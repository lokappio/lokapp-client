<template>
  <div class="my-projects-container">
    <key-creation :is-open="isOpenCreation" v-on:closeCreation="() => this.isOpenCreation = false"></key-creation>
    <v-container fluid>

      <Header class="header"/>

      <v-row no-gutters v-if="getItems.length <= 0" align-content="start" justify="center">
        <v-col cols="4">
          <action-button v-if="canUpdateKey" block :handler="() => this.isOpenCreation = true" :text="''" addIcon/>
        </v-col>
      </v-row>

      <v-row no-gutters v-else class="content">
        <v-col cols="12" class="fill-height">
          <v-data-table
              hide-default-footer
              fixed-header
              :headers="headers"
              :items="getItems"
              :loading="loading"
              item-class="text-3"
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
                  v-on:saveKey="(value) => keySaved(value)"
                  v-on:deleteKey="(value) => keyDeleted(value)"
              />

              <template-item-values
                  v-else
                  :key="`${item.key.id}_${item.languages[header.value].id}_${header.value}`"
                  :item="item"
                  :header="header"
                  :projectId="projectId"
                  @valueSaved="valueSaved"
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

export default Vue.extend({
  name: "content-details",
  components: {
    TemplateItemValues,
    TemplateGroupHeader,
    TemplateGroupFooter,
    TemplateItemKeys,
    Header,
    KeyCreation
  },
  data() {
    return {
      basicHeaders: [
        {
          text: this.$t("project_detail.keys").toString(),
          align: "start",
          value: "keys",
          width: "400px",
          sortable: false,
          groupable: false
        }
      ] as DataTableHeader[],
      headers: [] as DataTableHeader[],
      loading: false,
      projectId: -1,
      isOpenCreation: false
    };
  },
  mounted() {
    this.projectId = this.$store.getters.currentProject.id;
    this.filterDataWithLanguage(null);
  },
  watch: {
    "actualLanguage": function () {
      this.filterDataWithLanguage(this.actualLanguage);
    },
    "$store.state.currentProject": {
      deep: true,
      handler: function () {
        this.filterDataWithLanguage(this.actualLanguage);
      }
    }
  },
  computed: {
    searchValue(): string {
      return this.$store.state.searchTranslation;
    },
    canUpdateKey(): boolean {
      return this.$store.getters.appUser.roleAbility ? this.$store.getters.appUser.roleAbility.canWriteKey : false;
    },
    actualLanguage(): number {
      return this.$store.getters.actualLanguage;
    },
    getItems(): translationItem[] {
      const currProject: Project = this.$store.state.currentProject;
      const items: any[] = [];

      currProject.groups?.forEach((group) => {
        group.keys?.filter((key) => key.name.includes(this.searchValue)).forEach((key) => {
          if (key.isPlural) {
            Object.values(ValueQuantity).forEach((quantity) => {
              const item: translationItem = {
                "key": key,
                "group": group,
                "quantity": quantity,
                languages: {}
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

      return items;
    }
  },
  methods: {
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
    filterDataWithLanguage(languageId: number): void {
      const languages: Language[] = this.$store.getters.currentProject.languages;
      this.headers = Array.from(this.basicHeaders);

      if (languageId == null) {
        languages.forEach((language) => {
          this.headers.push({
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
        const language: Language = languages.find((item) => item.id === languageId);

        this.headers.push({
          text: language.name,
          align: "start",
          value: language.id.toString(),
          width: "400px",
          sortable: false,
          filterable: true,
          groupable: false
        });
      }
    }
  }
});
</script>

<style lang="scss">
@import '~vuetify/src/styles/settings/_variables';

.my-projects-container {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: var(--v-background-base);
  height: 100%;
  width: 100%;
}

@mixin styling($base-height) {
  .header {
    margin-top: 20px;
    height: $base-height;
  }
  .content {
    position: absolute;
    top: calc($base-height + 20px);
    bottom: 0;
    width: 100%;
  }
}

@media #{map-get($display-breakpoints, 'sm-and-down')} {
  @include styling($base-height: 200px);
}

@media #{map-get($display-breakpoints, 'md-and-up')} {
  @include styling($base-height: 120px);
}

.no-data-button {
  margin-left: 45%;
}

.v-data-table--fixed-header thead th {
  background: var(--v-background-base) !important;
}

.my-custom-table {
  background-color: transparent !important;
  height: 100% !important;

  .v-data-table__wrapper {
    height: 100% !important;
    overflow-y: scroll;
  }

  table {
    border-spacing: 0 16px !important;
  }
}

.v-row-group__summary {
  background-color: transparent !important;
}
</style>