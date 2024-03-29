<template>
  <div class="my-projects-container" id="project-container">
    <key-creation :is-open="isOpenCreation" v-on:closeCreation="() => isOpenCreation = false"></key-creation>
    <v-container fluid>

      <DetailHeader class="header" id="header"
                    :selected-target-language-id="this.actualLanguage"
                    :selected-source-language-id="this.selectedSourceLanguageId"
                    @source-language-id-changed="onSelectedSourceLanguageIdChanged"/>

      <v-row no-gutters v-if="items.length <= 0" align-content="start" justify="center">
        <v-col cols="4">
          <action-button v-if="canUpdateKey" block :handler="() => isOpenCreation = true" :text="''" addIcon/>
        </v-col>
      </v-row>

      <v-row no-gutters v-else class="content">
        <v-col :cols="selectedItem['key'] ? 10 : 12" class="fill-height">
          <div class="content_wrapper" id="content_wrapper">
            <v-alert
                v-for="warning in projectWarnings"
                :key="warning.reason"
                color="orange"
                outlined text
                dismissible
            >{{ warning.reason }}
              <template v-slot:close="{toggle}">
                <v-btn icon>
                  <v-icon color="orange" @click="() =>{removeWarning(warning);toggle();}"
                  >mdi-close
                  </v-icon>
                </v-btn>
              </template>
            </v-alert>

            <v-data-table fixed-header :headers="headers" :items="items" :loading="loading" group-by="group.id" :page.sync="page"
                          elevation="0" :footer-props="{'items-per-page-options': [30, 50, 100, 200, -1] }" :items-per-page.sync="itemsPerPage" class="my-custom-table">

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
                :selectedLanguageId="selectedTargetLanguageId"/>
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
import DetailHeader from "@/components/molecules/project/DetailHeader.vue";
import KeyCreation from "@/components/molecules/cards/overlay/KeyCreation.vue";
import Language, {LanguageAccess} from "@/data/models/api/Language";
import Project from "@/data/models/api/Project";
import Key from "@/data/models/api/Key";
import Value, {ValueQuantity} from "@/data/models/api/Value";
import {TranslationItem} from "@/data/models/types/TranslationTypes";
import {DataTableHeader} from "vuetify";
import ImportError from "@/data/models/ImportError";
import ValueDetails from "@/components/molecules/project/ValueDetails.vue";
import {mapState} from 'vuex';

export default Vue.extend({
  name: "content-details",
  components: {
    ValueDetails,
    TemplateItemValues,
    TemplateGroupHeader,
    TemplateGroupFooter,
    TemplateItemKeys,
    DetailHeader,
    KeyCreation
  },
  data() {
    return {
      loading: false,
      projectId: -1,
      isOpenCreation: false,
      selectedItem: {},
      selectedTargetLanguageId: -1,
      selectedSourceLanguageId: -1,
      page: 1,
      itemsPerPage: 50,
      observer: null
    };
  },

  created() {
    const selectedSourceLanguage = this.$store.getters.currentProject.languages.find((e: Language) => e.access === LanguageAccess.source)
    this.selectedSourceLanguageId = selectedSourceLanguage ? selectedSourceLanguage.id : -1;
    this.$nextTick(() => this.resizeContent());

    this.$nextTick(() => {
      this.observer = new MutationObserver(() => {
        this.resizeContent();
      });

      this.observer.observe(document.querySelector('.my-custom-table'), { childList: true, subtree: true, attributes: true});
    });
  },
  mounted() {
    this.projectId = this.$store.getters.currentProject.id;
    window.addEventListener('resize', this.resizeContent);
  },
  destroyed() {
    if (this.observer) {
      this.observer.disconnect();
    }

    window.removeEventListener('resize', this.resizeContent);
  },
  computed: {
    ...mapState(['currentProject', 'searchTranslation']),
    projectWarnings(): ImportError[] {
      const value = localStorage.getItem(this.projectId.toString());

      return value?.length > 0 ? JSON.parse(value) : [];
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
        // If there are no actual language selected, we show all languages
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
        // If there are source languages, we must show it first
        const sourceLanguage: Language = languages.find((item) => item.id === this.selectedSourceLanguageId);
        if (sourceLanguage) {
          headers.push({
            text: sourceLanguage.name,
            align: "start",
            value: sourceLanguage.id.toString(),
            width: "400px",
            sortable: false,
            filterable: true,
            groupable: false
          });
        }

        // Then, we show the actual language
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
    items: function (): TranslationItem[] {
      return (this.currentProject as Project).groups?.map((group) => {
        return group.keys?.filter((key) => key.matchSearch(this.searchTranslation))
            .map((key) => {
              if (key.isPlural) {
                return Object.values(ValueQuantity).map((quantity) => ({
                  key, group,
                  quantity: quantity as ValueQuantity,
                  languages: key.values?.filter(value => value.quantityString === quantity)
                      .reduce((acc, value) => ({...acc, [value.languageId]: value}), {})
                }))
              } else {
                return {
                  key, group,
                  languages: key.values?.reduce((acc, value) => ({...acc, [value.languageId]: value}), {})
                };
              }
            });
      }).flat(2).filter((item) => item);
    }
  },
  methods: {
    resizeContent() {
      const r = document.querySelector(':root') as HTMLElement;
      this.$nextTick(() => {
        const headerHeight = document.getElementById('header').clientHeight;
        r.style.setProperty('--tableHeight', `${window.innerHeight - headerHeight - 180}px`);
      });
    },
    onSelectedSourceLanguageIdChanged(newId: number) {
      this.selectedSourceLanguageId = newId;
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
    valueClicked(item: TranslationItem, languageId: number) {
      this.selectedItem = item;
      this.selectedTargetLanguageId = languageId;
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

.no-data-button {
  margin-left: 45%;
}

.v-data-table--fixed-header thead th {
  background: var(--v-background-base) !important;
}

.content_wrapper {
  min-height: 80vh !important;
  margin-right: 30px !important;
}

.my-custom-table {
  background-color: transparent !important;
  height: 100% !important;

  .v-data-table__wrapper {
    height: var(--tableHeight) !important;
  }

  table {
    border-spacing: 0 0 !important;
  }
}

.v-row-group__summary {
  background-color: transparent !important;
}
</style>
