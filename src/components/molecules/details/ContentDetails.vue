
<template>
    <v-container class="full-contain my-table">

        <v-row v-if="items.length === 0" align-content="start" justify="center" class="middle-row my-0 mx-auto">
            <v-col cols="4">
                <action-button v-if="canUpdateKey()" block :handler="openKeyCreationWithName" :text="''" addIcon/>
            </v-col>
        </v-row>

        <v-data-table v-show="items.length > 0"
        hide-default-footer
        :headers="headers"
        :items="items"
        :loading="loading"
        :search="searchValue"
        :item-class="setupCreateKeyClass"
        item-key="id"
        disable-pagination
        group-by="group"
        elevation="0"
        class="my-custom-table">

            <!-- Change keys -->
            <template v-if="canUpdateKey()" v-slot:[`item.keys`]="{ item }">
                <template-item-keys 
                    :item="item"
                    :projectId="projectId"
                    :refreshEverything="refreshEverything"
                    :items="items"
                    :resetKeys="resetKeys"/>
            </template>

            <!-- Change values -->
            <template v-for="header in getLanguagesHeaders()" v-slot:[customValueSlotName(header.value)]="{ item }">
               <template-item-values
                    :key="header.value" 
                    :item="item" 
                    :header="header" 
                    :projectId="projectId"
                    :items="items"
                    :getActualLineIndex="getActualLineIndex"
                    :refreshEverything="refreshEverything"/>
            </template>

            <!-- Custom header for groups -->
            <template v-slot:[`group.header`]="{group, items, isOpen, toggle}">
                <template-group-header 
                    :headers="headers"
                    :group="group"
                    :items="items"
                    :isOpen="isOpen"
                    :toggle="toggle"
                    :groups="groups"
                    :projectId="projectId"/>
            </template>

            <!-- Custom footer on groups -->
            <template v-if="canUpdateKey()" v-slot:[`group.summary`]="{ isOpen, group }">
                <template-group-footer :isOpen="isOpen" :group="group" :openKeyCreationWithName="openKeyCreationWithName"/>
            </template>

        </v-data-table>
    </v-container>
</template>

<script>
import Vue from "vue";
import TemplateItemValues from "@/components/molecules/details/template-v-data-table/TemplateItemValues";
import TemplateItemKeys from "@/components/molecules/details/template-v-data-table/TemplateItemKeys";
import TemplateGroupHeader from "@/components/molecules/details/template-v-data-table/TemplateGroupHeader";
import TemplateGroupFooter from "@/components/molecules/details/template-v-data-table/TemplateGroupFooter";
import {PluralTemplate, PLURAL_DEFAULT} from "@/data/models/PluralTemplate";
import EventEnum from "@/data/enum/event-bus.enum";
import CardEnum from "@/data/models/Card.enum";
import ActionButton from "@/components/molecules/buttons/ActionButton.vue";

export default Vue.extend({
  name: 'content-details',
  components: {
    TemplateItemValues,
    TemplateGroupHeader,
    TemplateGroupFooter,
    TemplateItemKeys,
    ActionButton
  },
  created() {
    this.projectId = this.$store.getters.actualProjectId;
    this.refreshEverything();
  },
  data() {
    return {
      basicHeaders: [
        {
          text: 'Groupe',
          value: 'group',
          align: 'start',
          width: '400px',
          sortable: false,
          filterable: false,
          groupable: true,
        },
        {
          text: this.$t("project_detail.keys"),
          align: 'start',
          value: 'keys',
          width: '400px',
          sortable: false,
          groupable: false,
        }
      ],
      headers: [],
      items: [],
      groups: [],
      id: 0,
      loading: true,
      searchValue: "",
      projectId: -1
    }
  },
  methods: {
    canUpdateKey() {
      return this.$store.getters.actualRole ? this.$store.getters.actualRole.canWriteKey : false
    },
    errorGetSomething() {
      this.$eventBus.$emit(EventEnum.ERROR_GET_SOMETHING);
    },
    filterDataWithLanguage(languageId) {
      this.loading = true;

      if (languageId === -1) {
        //Tab ALl languages
        this.$service.languages.getLanguages(this.projectId)
            .then((languages) => {
              this.headers = this.basicHeaders.concat();
              for (const language of Object.values(languages)) {
                this.headers.push({
                  text: language.name,
                  align: 'start',
                  value: language.id.toString(),
                  width: '400px',
                  sortable: false,
                  filterable: true,
                  groupable: false
                });
              }
            }).catch(() => {
          this.errorGetSomething();
        }).finally(() => {
          this.loading = false;
        });
      } else {
        //Tab specific language
        this.$service.languages.getLanguage(this.projectId, languageId)
            .then((language) => {
              this.headers = this.basicHeaders.concat();
              this.headers.push({
                text: language.name,
                align: 'start',
                value: languageId.toString(),
                width: '400px',
                sortable: false,
                filterable: true,
                groupable: false
              });
            }).catch(() => {
          this.notify(this.$t("errors.not_existing_language"));
          this.$eventBus.$emit(EventEnum.REFRESH_LANGUAGES_LIST);
        }).finally(() => {
          this.loading = false;
        });
      }
    },
    refreshEverything() {
      this.loading = true;
      this.$service.languages.getLanguages(this.projectId)
          .then((languages) => {
            this.headers = this.basicHeaders.concat();
            for (const language of Object.values(languages)) {
              this.headers.push({
                text: language.name,
                align: 'start',
                value: language.id.toString(),
                width: '400px',
                sortable: false,
                filterable: true,
                groupable: false,
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
    },
    resetKeys() {
      this.items = [];
    },
    getActualLineIndex(keyId, quantity) {
      return (this.items.findIndex((element) => {
        if (element.keyId === keyId && element.quantity === quantity)
          return true;
        return false;
      }));
    },
    openKeyCreationWithName(groupName) {
      const actualGroup = this.groups.findIndex((group) => group.groupName === groupName);
      if (actualGroup === -1) {
        this.openKeyCreation(-1);
      } else {
        this.openKeyCreation(this.groups[actualGroup].groupId);
      }
    },
    openKeyCreation(groupId) {
      this.$store.commit("SET_ACTUAL_GROUP_ID", groupId);
      this.$store.commit("SET_OPEN_CARD", CardEnum.CREATE_KEY);
    },
    filterKeys(value) {
      this.searchValue = value;
    },
    setupCreateKeyClass() {
      return 'text-3 data-table-key-style';
    },
    customValueSlotName(name) {
      return "item." + name;
    },
    getLanguagesHeaders() {
      const languages = [];
      for (let index = 0; index < this.headers.length; index++) {
        const element = this.headers[index];
        if (element.value != 'group' && element.value != 'keys') {
          languages.push(element);
        }
      }
      return languages;
    },
    downloadProject(platform) {
      this.$eventBus.$emit(EventEnum.DOWNLOAD_IS_FINISHED, platform, this.$service.export.exportDatas(platform, this.headers, this.items, this.groups));
    }
  },
  mounted() {
    this.$eventBus.$on(EventEnum.FILTER_DATA_WITH_LANGUAGE, this.filterDataWithLanguage);
    this.$eventBus.$on(EventEnum.FILTER_KEYS, this.filterKeys);
    this.$eventBus.$on(EventEnum.REFRESH_KEYS_LIST, this.refreshEverything);
    this.$eventBus.$on(EventEnum.DOWNLOAD_PROJECT, this.downloadProject);
  }
})
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