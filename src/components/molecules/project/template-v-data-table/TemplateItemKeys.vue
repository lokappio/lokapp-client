<template>
  <v-menu offset-y :close-on-content-click="false" :value="isOpen">
    <template v-slot:activator="{ on }">
      <p v-on="on" @click="isOpen = true" class="pa-0 ma-0 span-keys-with-overflow"> {{ keyQuantityName }}</p>
    </template>

    <v-card class="pa-2">
      <v-text-field
          v-model="updateKey.name"
          single-line
          :rules="keyNameRules"
          @keydown.enter="saveKey"
      >
        <template v-slot:append-outer>
          <v-container>
            <v-row>
              <v-col cols="12" class="pa-0">
                <!-- Button plural -->
                <v-btn color="maincolor" @click="updateKey.isPlural = !updateKey.isPlural" class="mb-2 white--text">
                  {{ updateKey.isPlural ? $t("project_detail.plural_key") : $t("project_detail.simple_key") }}
                </v-btn>

                <!-- ButtonValid -->
                <v-btn v-if="updateKey.isPlural !== item.key.isPlural" @click="() => saveKey()" color="maincolor" class="mb-2 ml-1">
                  <v-icon color="white">
                    mdi-check
                  </v-icon>
                </v-btn>
              </v-col>

              <v-col cols="12" class="pa-0">
                <!-- ButtonDelete -->
                <v-btn color="maincolor" @click="deleteKey()" class="mb-2 white--text">
                  {{ $t("project_detail.delete_key_button") }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </template>
      </v-text-field>
    </v-card>

  </v-menu>
</template>

<script lang="ts">
import EventEnum from "@/data/enum/event-bus.enum";
import {keyNameRules} from "@/data/rules/KeyRules";
import Vue from "vue";
import {translationItem} from "@/data/models/types/TranslationTypes";

export default Vue.extend({
  name: "template-item-keys",
  props: {
    item: translationItem,
    projectId: Number,
  },
  data() {
    return {
      updateKey: Object.assign({}, this.item.key),
      isOpen: false,
      keyNameRules: keyNameRules(this.$t("rules.required"), this.$t("rules.key_name_length"), this.$t("rules.snake_case_only"))
    };
  },

  computed: {
    keyQuantityName() {
      return this.item?.quantity ? (this.item.key.name + "[" + this.item.quantity + "]") : this.item.key.name;
    }
  },
  methods: {
    saveKey() {
      this.$service.keys.updateKey(this.updateKey)
          .then(() => {
            this.isOpen = false
            this.$emit("saveKey", this.updateKey);
          })
          .catch((error) => {
            if (!error.response) {
              return;
            }
            switch (error.response.status) {
              case 422:
                this.notify(this.$t("errors.key_name_already_exists"));
                break;
              case 403:
                this.$notify(this.$t("errors.unauthorized"));
                break;
              case 404:
                this.notify(this.$t("errors.not_existing_key"));
                break;
              default:
                this.notify(this.$t("errors.unknown_error"));
                break;
            }
            this.$eventBus.$emit(EventEnum.ERROR_ACTION);
          });
    },
    deleteKey() {
      this.$service.keys.deleteKey(this.item.key.id)
          .then(() => {
            this.isOpen = false
            this.$emit("deleteKey", this.updateKey);
          }).catch((error) => {
        if (error.response) {
          switch (error.response.status) {
            case 404:
              this.$notify(this.$t("errors.not_existing_key"));
              break;
            case 403:
              this.$notify(this.$t("errors.unauthorized"));
              break;
            default:
              this.$notify(this.$t("errors.unknown_error"));
              break;
          }
        }
      });
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