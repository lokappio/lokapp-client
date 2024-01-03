<template>
  <div class="my-projects-container">
    <key-creation :is-open="isOpenCreation" v-on:closeCreation="() => isOpenCreation = false"></key-creation>
    <v-container fluid>

      <Header class="header"/>

      <v-row no-gutters v-if="items.length <= 0" align-content="start" justify="center">
        <v-col cols="4">
          <action-button v-if="canUpdateKey" block :handler="() => isOpenCreation = true" :text="''" addIcon/>
        </v-col>
      </v-row>

      <v-row no-gutters v-else class="content">
        <v-col cols="10" class="fill-height">
          <div class="content_wrapper">
            <v-alert
                v-for="warning in projectWarnings"
                :key="warning.reason"
                color="orange"
                outlined text
                dismissible
            >{{ warning.reason }}
              <template v-slot:close="{toggle}">
                <v-btn icon>
                  <v-icon color="orange" @click="() =>{
                  removeWarning(warning);
                  toggle();
                }"
                  >mdi-close
                  </v-icon>
                </v-btn>
              </template>
            </v-alert>

            <v-data-table
                hide-default-footer
                fixed-header
                :headers="headers"
                :items="items"
                :loading="loading"
                disable-pagination
                group-by="group.id"
                elevation="0"
                class="my-custom-table">

              <template v-for="header in headers" v-slot:[`item.${header.value}`]="{ item }">
                <template-item-keys
                    v-if="header.value === 'keys'"
                    :key="`${item.key.id}_${item.quantity != null ? item.quantity : ''}_${header.value}`"
                    :item="item"
                    :projectId="projectId"
                    :canUpdate="canUpdateKey"
                    v-on:saveKey="(value) => keySaved(value)"
                    v-on:deleteKey="(value) => keyDeleted(value)"
                />

                <TemplateItemValues
                    v-else
                    :key="`${item.key.id}_${item.languages[header.value]?.id}_${header.value}`"
                    :item="item"
                    :header="header"
                    :projectId="projectId"
                    @valueSaved="valueSaved"
                    @valueClicked="valueClicked"
                />
              </template>

              <!-- Custom header for groups -->
              <template v-slot:group.header="{group, items, isOpen, toggle}">
                <template-group-header
                    :headers="headers"
                    :groupId="group"
                    :items="items"
                    :isOpen="isOpen"
                    :toggle="toggle"
                />
              </template>

              <!-- Custom footer on groups -->
              <template v-if="canUpdateKey" v-slot:group.summary="{ isOpen, group, items }">
                <template-group-footer :isOpen="isOpen" :groupId="group" :items="items"/>
              </template>
            </v-data-table>
          </div>
        </v-col>
        <v-col cols="2" class="fill-height" v-if="selectedItem['key']">
          <div>
            <ValueDetails
                :selectedItem="selectedItem"
                :selectedLanguageId="selectedLanguageId"/>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TemplateItemValues from "@/components/molecules/project/template-v-data-table/TemplateItemValues.vue";
import TemplateItemKeys from "@/components/molecules/project/template-v-data-table/TemplateItemKeys.vue";
import TemplateGroupHeader from "@/components/molecules/project/template-v-data-table/TemplateGroupHeader.vue";
import TemplateGroupFooter from "@/components/molecules/project/template-v-data-table/TemplateGroupFooter.vue";
import Header from "@/components/molecules/project/DetailHeader.vue";
import KeyCreation from "@/components/molecules/cards/overlay/KeyCreation.vue";
import Language from "@/data/models/api/Language";
import Project from "@/data/models/api/Project";
import Key from "@/data/models/api/Key";
import Value, {ValueQuantity} from "@/data/models/api/Value";
import {translationItem} from "@/data/models/types/TranslationTypes";
import {DataTableHeader} from "vuetify";
import ImportError from "@/data/models/ImportError";
import ValueDetails from "@/components/molecules/project/ValueDetails.vue";
import { mapState } from 'vuex';

export default Vue.extend({
  name: "content-details",
  components: {
    ValueDetails,
    TemplateItemValues,
    TemplateGroupHeader,
    TemplateGroupFooter,
    TemplateItemKeys,
    Header,
    KeyCreation
  },
  data() {
    return {
      loading: false,
      projectId: -1,
      isOpenCreation: false,
      selectedItem: {},
      selectedLanguageId: -1,
      items: [],
    };
  },
  mounted() {
    this.projectId = this.$store.getters.currentProject.id;
    this.getItems();
  },
  computed: {
    ...mapState(['currentProject']),
    projectWarnings(): ImportError[] {
      const value = localStorage.getItem(this.projectId.toString());

      return value?.length > 0 ? JSON.parse(value) : [];
    },
    searchValue(): string {
      return this.$store.state.searchTranslation;
    },
    canUpdateKey(): boolean {
      return this.$store.getters.appUser.roleAbility ? this.$store.getters.appUser.roleAbility.canWriteKey : false;
    },
    actualLanguage(): number {
      return this.$store.getters.actualLanguage;
    },
    headers(): DataTableHeader[] {
      const languages: Language[] = this.$store.getters.currentProject.languages.filter((e: Language) => e !== undefined);

      const headers: DataTableHeader[] = [
        {
          text: this.$t("project_detail.keys").toString(),
          align: "start",
          value: "keys",
          width: "400px",
          sortable: false,
          groupable: false
        }
      ];

      if (!this.actualLanguage) {
        languages.forEach((language) => {
          headers.push({
            text: language.name,
            align: "start",
            value: language.id.toString(),
            width: "400px",
            sortable: false,
            filterable: true,
            groupable: false
          });
        });
      } else {
        const language: Language = languages.find((item) => item.id === this.actualLanguage);

        headers.push({
          text: language.name,
          align: "start",
          value: language.id.toString(),
          width: "400px",
          sortable: false,
          filterable: true,
          groupable: false
        });
      }

      return headers;
    },
  },
  watch: {
    currentProject() {
      // If current project is changed in the store, we must reload items
      this.getItems();
    },
  },
  methods: {
    getItems() {
      const currProject: Project = this.currentProject as Project;
      const items: any[] = [];

      currProject.groups?.forEach((group) => {
        group.keys?.filter((key) => key.name.includes(this.searchValue)).forEach((key) => {
          if (key.isPlural) {
            Object.values(ValueQuantity).forEach((quantity) => {
              const item: translationItem = {
                "key": key,
                "group": group,
                "quantity": quantity as ValueQuantity,
                "languages": {}
              };

              key.values?.filter((value) => value.quantityString === quantity).forEach((value) => {
                item.languages[value.languageId] = value;
              });

              items.push(item);
            });
          } else {
            const item: translationItem = {
              "key": key,
              "group": group,
              languages: {}
            };

            key.values?.forEach((value) => {
              item.languages[value.languageId] = value;
            });

            items.push(item);
          }
        });
      });

      this.items = items;
    },
    keySaved(value: Key): void {
      //USED TO REFRESH ITEMS, WITHOUT RELOADING ALL PROJECT WITH API CALL
      this.$store.commit("UPDATE_PROJECT_KEY", value);
    },
    keyDeleted(value: Key): void {
      //USED TO REFRESH ITEMS, WITHOUT RELOADING ALL PROJECT WITH API CALL
      this.$store.commit("DELETE_PROJECT_KEY", value);
    },
    valueSaved(value: Value) {
      this.$store.commit("UPDATE_PROJECT_VALUE", value);
    },
    removeWarning(item: ImportError) {
      const index = this.projectWarnings.indexOf(item);
      this.projectWarnings.splice(index, 1)

      localStorage.setItem(this.projectId.toString(), JSON.stringify(this.projectWarnings));
    },
    valueClicked(item: translationItem, languageId: number) {
      this.selectedItem = item;
      this.selectedLanguageId = languageId;
    }
  }
});
</script>

<style lang="scss">
@import '~vuetify/src/styles/settings/_variables.scss';

.my-projects-container {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: var(--v-background-base);
  height: calc(100% - 50px); // 50px == language tab height
  width: 100%;
}

@mixin styling($base-height) {
  .header {
    margin-top: 20px;
    height: $base-height;
  }
  .content {
    position: absolute;
    top: calc(#{$base-height} + 20px);
    bottom: 0;
    width: 100%;
  }
}

@media #{map-get($display-breakpoints, 'sm-and-down')} {
  @include styling($base-height: 220px);
}

@media #{map-get($display-breakpoints, 'md-and-up')} {
  @include styling($base-height: 140px);
}

.no-data-button {
  margin-left: 45%;
}

.v-data-table--fixed-header thead th {
  background: var(--v-background-base) !important;
}

.content_wrapper {
  height: 100% !important;
  margin-right: 30px !important;
  overflow-y: scroll;
}

.my-custom-table {
  background-color: transparent !important;
  height: 100% !important;

  table {
    border-spacing: 0 0 !important;
  }
}

.v-row-group__summary {
  background-color: transparent !important;
}
</style>
