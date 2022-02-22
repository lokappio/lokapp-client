<template>
  <div>
    <v-dialog v-model="dialogOpenedDelete" max-width="500px">
      <delete-key :dialog-opened="dialogOpenedDelete" :item="item" @close="() => this.dialogOpenedDelete = false" @deletedKey="deletedKey"/>
    </v-dialog>

    <v-row align="center">
      <v-btn v-if="canUpdate" color="primary" icon @click="() => this.dialogOpenedDelete = true" class="white--text mr-1">
        <v-icon>mdi-delete</v-icon>
      </v-btn>

      <v-btn :disabled="!canUpdate" color="primary" small depressed @click="switchQuantity" class="white--text mx-2">
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
  </div>
</template>

<script lang="ts">
import {keyNameRules} from "@/data/rules/KeyRules";
import Vue from "vue";
import {translationItem} from "@/data/models/types/TranslationTypes";
import Key from "@/data/models/api/Key";
import DeleteKey from "@/components/molecules/cards/overlay/DeleteKey.vue";

export default Vue.extend({
  name: "template-item-keys",
  components: {DeleteKey},
  props: {
    item: {},
    projectId: Number,
    canUpdate: Boolean
  },
  data() {
    return {
      dialogOpenedDelete: false,
      updateKey: Object.assign(Key.map({}), (this.item as translationItem).key),
      loading: false,
      inputIcon: "",
      keyNameRules: keyNameRules()
    };
  },
  watch: {
    item: {
      handler: function () {
        this.updateKey = Object.assign(Key.map({}), (this.item as translationItem).key);
      }
    }
  },
  computed: {
    keyQuantityName(): string {
      return (this.item as translationItem)?.quantity ? `[${(this.item as translationItem).quantity}]` : "";
    }
  },
  methods: {
    switchQuantity(): Promise<void> {
      this.updateKey.isPlural = !this.updateKey.isPlural;
      return this.saveKey(true);
    },
    saveKey(pluralChanged = false): Promise<void> {
      this.loading = true;

      return this.$service.keys.updateKey(this.updateKey)
          .then((result) => {
            this.loading = false;
            this.inputIcon = "mdi-check";
            this.$emit("saveKey", result);
            setTimeout(() => this.inputIcon = "", 1000);
          })
          .catch((error) => {
            this.$notify(this.$t(error).toString(), {color: "red"});
            if(pluralChanged) {
              //REVERT PLURAL UPDATE
              this.updateKey.isPlural = !this.updateKey.isPlural;
            }
          })
          .finally(() => this.loading = false);
    },
    deletedKey() {
      this.$emit("deleteKey", this.updateKey)
    }
  }
});
</script>
