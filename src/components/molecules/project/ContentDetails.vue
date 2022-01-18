<template>
  <v-container class="full-contain my-table">
    <v-row v-if="getItems.length === 0" align-content="start" justify="center" class="middle-row my-0 mx-auto">
      <v-col cols="4">
        <action-button v-if="canUpdateKey" block :handler="creationIsOpen = true" :text="''" addIcon/>
      </v-col>
    </v-row>

    <v-data-table
        v-show="getItems.length > 0"
        hide-default-footer
        :headers="headers"
        :items="getItems"
        :loading="loading"
        item-class="text-3 data-table-key-style"
        disable-pagination
        group-by="group"
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
            :key="`${item.key.id}_${item[header.value].id}_${header.value}`"
            :item="item"
            :header="header"
            :projectId="projectId"
        />
      </template>

      <!-- Custom header for groups -->
      <template v-slot:group.header="{group, items, isOpen, toggle}">
        <template-group-header
            :headers="headers"
            :group="group"
            :items="items"
            :isOpen="isOpen"
            :toggle="toggle"
            :projectId="projectId"/>
      </template>

      <!-- Custom footer on groups -->
      <template v-if="canUpdateKey" v-slot:group.summary="{ isOpen, group }">
        <template-group-footer :isOpen="isOpen" :group="group"/>
      </template>
    </v-data-table>

    <key-creation :is-open="isOpenCreation" v-on:closeCreation="() => this.isOpenCreation = false"></key-creation>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import TemplateItemValues from "@/components/molecules/project/template-v-data-table/TemplateItemValues.vue";
import TemplateItemKeys from "@/components/molecules/project/template-v-data-table/TemplateItemKeys.vue";
import TemplateGroupHeader from "@/components/molecules/project/template-v-data-table/TemplateGroupHeader.vue";
import TemplateGroupFooter from "@/components/molecules/project/template-v-data-table/TemplateGroupFooter.vue";
import EventEnum from "@/data/enum/event-bus.enum";
import ActionButton from "@/components/molecules/buttons/ActionButton.vue";
import Language from "@/data/models/api/Language";
import Project from "@/data/models/api/Project";
import Key from "@/data/models/api/Key";
import {ValueQuantity} from "@/data/models/api/Value";
import {translationItem} from "@/data/models/types/TranslationTypes";
import KeyCreation from "@/components/molecules/cards/overlay/KeyCreation.vue";
import {DataTableHeader} from "vuetify";

export default Vue.extend({
  name: "content-details",
  components: {
    KeyCreation,
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
      ] as DataTableHeader[],
      headers: [],
      id: 0,
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
    "actualLanguage": function (value) {
      this.filterDataWithLanguage(value);
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
              "group": group
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
    keySaved(value: Key): void {
      //USED TO REFRESH ITEMS, WITHOUT RELOADING ALL PROJECT WITH API CALL
      this.$store.commit("UPDATE_PROJECT_KEY", value);
    },
    keyDeleted(value: Key): void {
      //USED TO REFRESH ITEMS, WITHOUT RELOADING ALL PROJECT WITH API CALL
      this.$store.commit("DELETE_PROJECT_KEY", value);
    },
    filterDataWithLanguage(languageId: number): void {
      const languages = this.$store.getters.currentProject.languages;
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