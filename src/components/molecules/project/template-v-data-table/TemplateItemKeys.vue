<template>
  <v-row align="center">
    <v-btn color="primary" icon @click="deleteKey()" class="white--text mr-1">
      <v-icon>mdi-delete</v-icon>
    </v-btn>

    <v-btn color="primary" small @click="switchQuantity" class="white--text mx-2">
      {{ updateKey.isPlural ? $t("project_detail.plural_key") : $t("project_detail.simple_key") }}
    </v-btn>

    <v-text-field
        v-model="updateKey.name"
        single-line
        :rules="keyNameRules"
        @keydown.enter="saveKey"
        class="mx-2"
    >
      <template v-slot:append>
        <v-progress-circular v-if="loading" size="20" indeterminate color="primary"></v-progress-circular>
        <v-icon v-else color="primary" size="20">{{ inputIcon }}</v-icon>
      </template>

    </v-text-field>
    <p>{{ keyQuantityName }}</p>
  </v-row>
</template>

<script lang="ts">
import {keyNameRules} from "@/data/rules/KeyRules";
import Vue from "vue";
import {translationItem} from "@/data/models/types/TranslationTypes";
import Key from "@/data/models/api/Key";

export default Vue.extend({
  name: "template-item-keys",
  props: {
    item: {},
    projectId: Number,
  },
  data() {
    return {
      updateKey: Object.assign(Key.map({}), (this.item as translationItem).key),
      loading: false,
      inputIcon: "",
      keyNameRules: keyNameRules()
    };
  },
  watch: {
    item: {
      handler: function() {
        this.updateKey = Object.assign(Key.map({}), (this.item as translationItem).key);
      }
    }
  },
  computed: {
    keyQuantityName(): string {
      return  (this.item as translationItem)?.quantity ? `[${(this.item as translationItem).quantity}]` : '';
    }
  },
  methods: {
    switchQuantity(): Promise<void> {
      this.updateKey.isPlural = !this.updateKey.isPlural;
      return this.saveKey();
    },
    saveKey(): Promise<void> {
      this.loading = true;

      return this.$service.keys.updateKey(this.updateKey)
          .then((result) => {
            this.loading = false;
            this.inputIcon = "mdi-check";
            this.$emit("saveKey", result);
            setTimeout(() => this.inputIcon = "", 1000);
          })
          .catch((error) => {
            if (!error.response) {
              return;
            }
            switch (error.response.status) {
              case 422:
                this.$notify(this.$t("errors.key_name_already_exists").toString());
                break;
              case 403:
                this.$notify(this.$t("errors.unauthorized").toString());
                break;
              case 404:
                this.$notify(this.$t("errors.not_existing_key").toString());
                break;
              default:
                this.$notify(this.$t("errors.unknown_error").toString());
                break;
            }
          });
    },
    deleteKey() {
      this.$service.keys.deleteKey((this.item as translationItem).key.id)
          .then(() => {
            this.$emit("deleteKey", this.updateKey);
          }).catch((error) => this.$notify(this.$t(error).toString()));
    }
  }
});
</script>

<style lang="scss" scoped>
.span-keys-with-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  white-space: nowrap;
  max-width: 48vw;
  width: 100%;
}
</style>