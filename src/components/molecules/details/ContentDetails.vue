<template>
  <v-container class="full-contain my-table">
    <v-row v-if="getItems.length === 0" align-content="start" justify="center" class="middle-row my-0 mx-auto">
      <v-col cols="4">
        <action-button v-if="canUpdateKey" block :handler="openKeyCreationWithName" :text="''" addIcon/>
      </v-col>
    </v-row>

    <v-data-table
        v-show="getItems.length > 0"
        hide-default-footer
        :headers="headers"
        :items="getItems"
        :loading="loading"
        :search="searchValue"
        item-class="text-3 data-table-key-style"
        disable-pagination
        group-by="group"
        elevation="0"
        class="my-custom-table">

      <template v-for="header in headers" v-slot:[`item.${header.value}`]="{ item }">
        <template-item-keys
            v-if="header.value === 'keys'"
            :key="header.value"
            :item="item"
            :projectId="projectId"
            v-on:saveKey="(value) => keySaved(value)"
            v-on:deleteKey="(value) => keyDeleted(value)"
        />

        <template-item-values
            v-else
            :key="header.value"
            :item="item"
            :header="header"
            :projectId="projectId"
        />
      </template>

      <!-- Custom header for groups -->
      <template v-slot:group.header="{group, items, isOpen, toggle}">
        <template-group-header
            :key="group.id"
            :headers="headers"
            :group="group"
            :items="items"
            :isOpen="isOpen"
            :toggle="toggle"
            :projectId="projectId"/>
      </template>

      <!-- Custom footer on groups -->
      <template v-if="canUpdateKey" v-slot:group.summary="{ isOpen, group }">
        <template-group-footer :isOpen="isOpen" :group="group" :openKeyCreationWithName="() => openKeyCreationWithName(group)"/>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import TemplateItemValues from "@/components/molecules/details/template-v-data-table/TemplateItemValues";
import TemplateItemKeys from "@/components/molecules/details/template-v-data-table/TemplateItemKeys";
import TemplateGroupHeader from "@/components/molecules/details/template-v-data-table/TemplateGroupHeader";
import TemplateGroupFooter from "@/components/molecules/details/template-v-data-table/TemplateGroupFooter";
import {PluralTemplate, PLURAL_DEFAULT} from "@/data/models/PluralTemplate";
import EventEnum from "@/data/enum/event-bus.enum";
import CardEnum from "@/data/models/Card.enum";
import ActionButton from "@/components/molecules/buttons/ActionButton.vue";
import Language from "@/data/models/api/Language";
import Project from "@/data/models/api/Project";
import NewKey from '@/data/models/api/NewKey';
import NewGroup from "@/data/models/api/NewGroup";
import NewValue, {ValueQuantity} from "@/data/models/api/NewValue";
import {translationItem} from "@/data/models/types/TranslationTypes";

export default Vue.extend({
  name: "content-details",
  components: {
   TemplateItemValues,
    TemplateGroupHeader,
    TemplateGroupFooter,
    TemplateItemKeys,
    ActionButton
  },
  data() {
    return {
      basicHeaders: [
        {
          text: "Groupe",
          value: "group",
          align: "start",
          width: "400px",
          sortable: false,
          filterable: false,
          groupable: true
        },
        {
          text: this.$t("project_detail.keys").toString(),
          align: "start",
          value: "keys",
          width: "400px",
          sortable: false,
          groupable: false
        }
      ] as any[],
      headers: [],
      id: 0,
      loading: true,
      searchValue: "",
      projectId: -1
    };
  },
  created() {
    this.projectId = this.$store.getters.actualProjectId;
  },
  computed: {
    canUpdateKey(): boolean {
      return this.$store.getters.actualRole ? this.$store.getters.actualRole.canWriteKey : false;
    },
    getItems(): translationItem[] {
      const currProject: Project = this.$store.state.currentProject;
      const items: any[] = [];

      currProject.groups?.forEach((group) => {
        group.keys?.forEach((key) => {
          if(key.isPlural) {
            Object.values(ValueQuantity).forEach((quantity) => {
              const item: translationItem = {
                "key": key,
                "group": group,
                "quantity": quantity
              };

              key.values?.filter((value) => value.quantityString === quantity).forEach((value) => {
                item[value.languageId] = value;
              });

              items.push(item);
            });
          } else {
            const item: translationItem = {
              "key": key,
              "group": group,
            };

            key.values?.forEach((value) => {
              item[value.languageId] = value;
            });

            items.push(item);
          }
        });
      });

      return items;
    }
  },
  methods: {
    keySaved(value: NewKey): void{
      //USED TO REFRESH ITEMS, WITHOUT RELOADING ALL PROJECT WITH API CALL
      this.$store.commit("UPDATE_PROJECT_KEY", value);
    },
    keyDeleted(value: NewKey): void {
      //USED TO REFRESH ITEMS, WITHOUT RELOADING ALL PROJECT WITH API CALL
      this.$store.commit("DELETE_PROJECT_KEY", value);
    },
    errorGetSomething() {
      this.$eventBus.$emit(EventEnum.ERROR_GET_SOMETHING);
    },
    filterDataWithLanguage(languageId: number): Promise<void> {
      this.loading = true;

      return this.$service.languages.getLanguages(this.projectId)
          .then((languages) => {
            this.headers = this.basicHeaders;

            if (languageId != -1) {
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
          })
          .catch((e) => {
            this.errorGetSomething();
          })
          .finally(() => this.loading = false);
    },
    /*refreshEverything() {
      this.loading = true;
      this.$service.languages.getLanguages(this.projectId)
          .then((languages) => {
            this.headers = this.basicHeaders.concat();
            for (const language of Object.values(languages)) {
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
            this.$service.values.getEveryValues(this.projectId)
                .then((values) => {
                  values.forEach((value) => {

                    //STEP 1 : Create the line where to stock value
                    if (this.getActualLineIndex(value.keyId, value.quantity) === -1) {
                      if (value.isPlural === false) {
                        //Create one line if key is single
                        this.items.push({
                          group: value.groupName,
                          groupId: value.groupId,
                          keys: value.keyName,
                          keyId: value.keyId,
                          id: this.id,
                          isPlural: value.isPlural,
                          hasPluralChanged: false,
                          quantity: null
                        });
                        this.id += 1;
                      } else if (this.getActualLineIndex(value.keyId, PLURAL_DEFAULT) === -1) {
                        //Check if lines are not already created
                        //Create several lines for every quantities if key is plural
                        Object.values(PluralTemplate).forEach(quantity => {
                          this.items.push({
                            group: value.groupName,
                            groupId: value.groupId,
                            keys: value.keyName,
                            keyId: value.keyId,
                            id: this.id,
                            isPlural: value.isPlural,
                            hasPluralChanged: false,
                            quantity: quantity
                          });
                          this.id += 1;
                        });
                      }
                    }

                    //STEP 2 : Get the line where to stock actual value
                    const actualLine = this.getActualLineIndex(value.keyId, value.quantity);
                    if (actualLine === -1) {
                      return;
                    }

                    //STEP 3 : Stock value inside line
                    if (value.languageId != null) {
                      this.$set(this.items[actualLine], value.languageId.toString(), value.valueName);
                    }

                    //STEP 4 : Add group to group list
                    const actualGroup = this.groups.findIndex((group) => group.groupId === value.groupId);
                    if (actualGroup === -1) {
                      this.groups.push({
                        groupId: value.groupId,
                        groupName: value.groupName,
                        groupActivated: false,
                        groupUpdatedName: value.groupName
                      });
                    }
                  });
                }).catch(() => {
              this.errorGetSomething();
            }).finally(() => {
              this.loading = false;
            });
          }).catch(() => {
        this.errorGetSomething();
      });
    },*/
    getActualLineIndex(keyId, quantity) {
      return (this.items.findIndex((element) => {
        if (element.keyId === keyId && element.quantity === quantity) {
          return true;
        }
        return false;
      }));
    },
    openKeyCreationWithName(group) {
      if (!group) {
        this.openKeyCreation(-1);
      } else {
        this.openKeyCreation(group.id);
      }
    },
    openKeyCreation(groupId) {
      this.$store.commit("SET_ACTUAL_GROUP_ID", groupId);
      this.$store.commit("SET_OPEN_CARD", CardEnum.CREATE_KEY);
    },
    filterKeys(value) {
      this.searchValue = value;
    },
    downloadProject(platform) {
      this.$eventBus.$emit(EventEnum.DOWNLOAD_IS_FINISHED, platform, this.$service.export.exportDatas(platform, this.headers, this.items, this.groups));
    }
  },
  mounted() {
    this.filterDataWithLanguage(1);
  }
  /*mounted() {
    this.$eventBus.$on(EventEnum.FILTER_DATA_WITH_LANGUAGE, this.filterDataWithLanguage);
    this.$eventBus.$on(EventEnum.FILTER_KEYS, this.filterKeys);
    this.$eventBus.$on(EventEnum.REFRESH_KEYS_LIST, this.refreshEverything);
    this.$eventBus.$on(EventEnum.DOWNLOAD_PROJECT, this.downloadProject);
  }*/
});
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';

.no-data-button {
  margin-left: 45%;
}

.my-table {
  max-width: 100%;
  overflow-y: scroll;
}

.my-custom-table {
  background-color: transparent !important;
}

.my-custom-table > .v-data-table__wrapper > table {
  border-spacing: 0px 16px !important;
}

.data-table-key-style {
  background-color: transparent;
}

.data-table-key-style > td {
  background-color: white;
  max-width: 50vw;
}

.v-row-group__summary {
  background-color: transparent !important;
}

.icon-style-big {
  font-size: 32px !important;
}
</style>