<template>
  <v-card color="white" class="pa-4 pa-md-7 custom-cards">
    <v-container>
      <!-- Title -->
      <v-row no-gutters :style="{ 'height':'50px' }">
        <v-col cols="11" class="px-0">
          <p class="title-h2">{{ $t("language_creation.title") }}</p>
        </v-col>

        <v-col cols="1" class="pr-0">
          <v-icon @click="closeLanguageCreation" color="black" class="float-right">mdi-close</v-icon>
        </v-col>
      </v-row>

      <v-form ref="formCreateLanguage" @submit.prevent="() => false">

        <!-- Language name -->
        <v-row no-gutters class="mt-4 pb-0 mb-2 align-center">
          <v-col class="pb-0 px-0">
            <span class="title-h3">{{ fromImport ? $t("language_creation.import_file_subtitle") : $t("language_creation.language_name_title") }}</span>
          </v-col>

          <v-col cols="auto">
            <v-btn text @click="fromImport = !fromImport">{{ fromImport ? $t("language_creation.newLanguage") : $t("language_creation.fromImport") }}</v-btn>
          </v-col>
        </v-row>

        <div v-if="!fromImport">
          <v-row no-gutters class="mt-0">
            <v-col cols="12" class="pb-0 pt-0 px-0">
              <v-text-field
                  autofocus
                  :rules="languageNameRules"
                  class="custom-text-field"
                  background-color="inputBackground"
                  v-model="languageName"
                  :label="$t('language_creation.language_name_label')"
                  solo
                  flat
                  required
                  @keydown.enter="createNewLanguage"></v-text-field>
            </v-col>
          </v-row>
        </div>

        <div v-else>
          <v-row no-gutters class="my-2">
            <v-col cols="12">
              <v-alert v-if="importError != null" :color="importError.color" outlined text>
                {{ importError.reason }}
              </v-alert>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12">
              <v-select
                  solo
                  background-color="primary"
                  dark
                  :items="platforms"
                  item-text="name"
                  v-model="selectedPlatform"
              ></v-select>
            </v-col>
          </v-row>

          <v-row no-gutters>
            <v-col cols="12">
              <v-expansion-panels class="mb-3" accordion flat>
                <v-expansion-panel>
                  <v-expansion-panel-header class="pa-0">{{ $t("imports.expansion_title") }}</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-alert v-for="(example, index) in expectedFormatExplain" :key="index" color="primary" text>
                      <pre>{{ example }}</pre>
                    </v-alert>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>

          <v-row no-gutters align-content="center">
            <v-col cols="12">
              <v-text-field
                  :rules="languageNameRules"
                  class="custom-text-field"
                  background-color="inputBackground"
                  v-model="importItem.language"
                  :label="$t('language_creation.language_name_label')"
                  solo
                  flat
                  required
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-file-input
                  prepend-icon=""
                  prepend-inner-icon="mdi-paperclip"
                  :accept="extensionLimitation"
                  class="custom-text-field"
                  :multiple="multipleFiles"
                  background-color="inputBackground"
                  :label="$t('project_creation.file_label')"
                  :rules="fileRules"
                  v-model="importItem.content"
                  solo
                  flat
              >
                <template v-slot:selection="{ text }">
                  <v-chip
                      small
                      label
                      color="primary"
                  >
                    {{ text }}
                  </v-chip>
                </template>
              </v-file-input>
            </v-col>
          </v-row>

          <!-- Checkbox option for Replace existing keys -->
          <v-row no-gutters align-content="center" class="mb-4">
            <v-col cols="12">
              <v-checkbox
                  class="custom-checkbox"
                  hide-details="true"
                  v-model="replaceExistingKeys">
                <template v-slot:label>
                  <div>
                    <p class="my-0" style="font-size: 0.85em; padding-top: 0.15em">
                      {{ $t('language_creation.replace_existing_keys') }}</p>
                  </div>
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
        </div>

        <!-- ValidateButton -->
        <v-row no-gutters class="pb-0">
          <v-col cols="12" class="pb-0 px-0">
            <action-button block :loading="loading" :handler="create"
                           :text="$t('language_creation.confirm_button')"/>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import {languageNameRules} from "@/data/rules/LanguageRules";
import Vue from "vue";
import {Platform, PlatformExtension, PlatformFileExpected} from "@/data/models/enums/project";
import ImportItem from "@/data/models/ImportItem";
import {importRules, iOSImportRules} from "@/data/rules/ImportRules";
import ImportError from "@/data/models/ImportError";
import Project from "@/data/models/api/Project";

export default Vue.extend({
  name: "language-creation",
  props: {dialogOpened: Boolean},
  data: function () {
    return {
      loading: false,
      languageName: "",
      languageNameRules: languageNameRules(),
      isBlockButton: true,
      fromImport: false,
      selectedPlatform: Platform.ANDROID,
      importItem: new ImportItem("", null) as ImportItem,
      importError: null as ImportError,
      replaceExistingKeys: false,
    };
  },
  watch: {
    dialogOpened(isOpened) {
      if (isOpened) {
        //ON RE-OPENED, RESET DATA
        this.languageName = "";
        this.fromImport = false;
        this.selectedPlatform = Platform.ANDROID;
        this.importItem = new ImportItem("", null) as ImportItem;
        (this.$refs.formCreateLanguage as Vue & { resetValidation: () => any }).resetValidation();
      }
    }
  },
  computed: {
    extensionLimitation(): string {
      return PlatformExtension(this.selectedPlatform);
    },
    platforms(): { id: number; name: string }[] {
      return Object.values(Platform).map((platform, index) => {
        return {id: index, name: platform};
      });
    },
    expectedFormatExplain(): string[] {
      return PlatformFileExpected(this.selectedPlatform);
    },
    multipleFiles(): boolean {
      return this.selectedPlatform === Platform.IOS;
    },
    fileRules(): any {
      return this.selectedPlatform === Platform.IOS ? iOSImportRules() : importRules();
    }
  },
  methods: {
    create() {
      if ((this.$refs.formCreateLanguage as Vue & { validate: () => boolean }).validate() === true) {
        if (this.fromImport) {
          this.createNewLanguageFromImport();
        } else {
          this.createNewLanguage();
        }
      }
    },
    createNewLanguageFromImport() {
      this.loading = true;

      this.$service.languages.createLanguageFromImport(this.$store.getters.currentProject, this.importItem, this.selectedPlatform, this.replaceExistingKeys)
          .then((result: Project) => {
            this.loading = false;
            this.$store.commit("SET_CURRENT_PROJECT", result);
            this.closeLanguageCreation();
          })
          .catch((e) => {
                console.error(e);
                if (e instanceof ImportError) {
                  this.importError = e;
                }

                this.$notify(this.$t("errors.unknown_error").toString(), {color: "red"});
              }
          )
          .finally(() => this.loading = false);
    },
    createNewLanguage() {
      this.loading = true;

      this.$service.languages.createLanguage(this.languageName.toLowerCase())
          .then((result) => {
            this.loading = false;
            this.$store.commit("UPDATE_PROJECT_LANGUAGES", result);

            this.closeLanguageCreation();
          })
          .catch((error) => this.$notify(this.$t(error).toString(), {color: "red"}))
          .finally(() => this.loading = false);
    },
    closeLanguageCreation() {
      this.$emit("close", false);
    }
  }
});

</script>
