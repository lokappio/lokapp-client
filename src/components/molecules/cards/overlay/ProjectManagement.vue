<template>
  <!-- Modification of project -->
  <v-card color="white" class="pa-4 pa-md-7 custom-cards">
    <v-container>
      <!-- Title -->
      <v-row :style="{ 'height':'50px' }">
        <v-col cols="11" class="px-0">
          <h2 class="title-h2">{{ this.isCreating ? this.$t("project_creation.title") : this.$t("project_manage.title") }}</h2>
        </v-col>

        <v-col cols="1" class="pr-0">
          <v-icon @click="closeManageProject" color="black" class="float-right">mdi-close</v-icon>
        </v-col>
      </v-row>

      <v-form ref="formChangeSettings">
        <!-- ProjectName -->
        <v-row class="mt-4 pb-0 mb-2">
          <v-col cols="12" class="pb-0 px-0">
            <span class="title-h3">{{ $t("project_creation.project_name_title") }}</span>
          </v-col>
        </v-row>

        <v-row class="mt-0 mb-2">
          <v-col cols="12" class="pa-0">
            <v-text-field
                class="custom-text-field"
                background-color="inputBackground"
                v-model="updatedProject.name"
                :rules="projectNameRules"
                :label="$t('project_creation.project_name_label')"
                hide-details="auto"
                solo
                flat
                required
            ></v-text-field>
          </v-col>
        </v-row>

        <!-- ProjectColor -->
        <v-row class="mt-0 mb-2">
          <v-col cols="12" class="pb-0 px-0">
            <span class="title-h3">{{ $t("project_creation.color_title") }}</span>
          </v-col>
        </v-row>

        <v-row>
          <v-col :style="{ 'height':'50px' }" cols="3" class="pa-0">
            <div class="current-project-color" :style="{ 'background-color':'#' + this.updatedProject.color }"></div>
          </v-col>
        </v-row>

        <v-row class="pt-4" justify="start">
          <v-col v-for="color in colors" :key="color" cols="1" class="button-color-picker-container pa-0 my-0 ml-0 mr-4">
            <v-btn
                class="button-color-picker pa-0 ma-0"
                :color="`#${color}`"
                @click="writtenColor = color"
                depressed
            ></v-btn>
          </v-col>
        </v-row>

        <v-row class="pt-3" justify="space-between">
          <v-col cols="12" class="pa-0">
            <v-text-field :rules="colorRules" class="custom-text-field" background-color="inputBackground" v-model="writtenColor" solo flat prefix="#"></v-text-field>
          </v-col>
        </v-row>

        <!-- DescriptionProject -->
        <v-row class="mt-2 pb-0 mb-2">
          <v-col cols="12" class="pb-0 px-0">
            <span class="title-h3">{{ $t("project_creation.description_title") }} <span class="text-2 grey--text"> {{ $t("common.optional") }}</span></span>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="py-0 px-0">
            <v-textarea
                background-color="inputBackground"
                flat
                solo
                no-resize
                rows="6"
                class="custom-text-area"
                v-model="updatedProject.description"
            ></v-textarea>
          </v-col>
        </v-row>

        <!-- LANGUAGE OR IMPORT -->
        <div v-if="isCreating">
          <v-row v-if="!fromImport">
            <v-col>
              <v-row class="mt-2 mb-2">
                <v-col cols="12" class="pb-0 px-0">
                  <span class="title-h3">{{ $t("project_creation.language_name_title") }}</span>
                </v-col>
              </v-row>

              <v-row class="mt-0 mb-2">
                <v-col cols="12" class="py-0 px-0">
                  <v-text-field
                      class="custom-text-field"
                      background-color="inputBackground"
                      v-model="languageName"
                      :rules="languageRules"
                      :label="$t('project_creation.language_name_label')"
                      solo
                      flat
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-btn text @click="fromImport = true">{{ $t("project_creation.fromImport") }}</v-btn>
            </v-col>
          </v-row>

          <v-row v-else class="mt-0 pb-0">
            <v-col cols="12">
              <v-row>
                <v-col cols="12" class="pb-0 px-0">
                  <span class="title-h3">{{ $t("project_creation.language_name_title") }}</span>
                </v-col>
              </v-row>

              <v-row v-for="(item, index) in importItems" :key="index" align-content="center">
                <v-col cols="3">
                  <v-text-field
                      class="custom-text-field"
                      background-color="inputBackground"
                      :label="$t('project_creation.language_name_label')"
                      :rules="languageRules"
                      v-model="item.language"
                      solo
                      flat
                  ></v-text-field>
                </v-col>

                <v-col cols="max">
                  <v-file-input
                      accept=".xml, .json, .strings, .stringsdict"
                      class="custom-text-field"
                      background-color="inputBackground"
                      :label="$t('project_creation.file_label')"
                      v-model="item.content"
                      solo
                      flat
                  ></v-file-input>
                </v-col>

                <v-col cols="auto">
                  <v-btn icon class="mx-2" @click="() => importItems.splice(index, 1)">
                    <v-icon color="primary">mdi-minus-circle</v-icon>
                  </v-btn>
                </v-col>
              </v-row>

              <v-row class="my-2" justify="space-between">
                <v-btn text @click="fromImport = false">{{ $t("project_creation.newProject") }}</v-btn>

                <v-btn icon @click="addImportItem">
                  <v-icon color="primary" large>mdi-plus-circle</v-icon>
                </v-btn>
              </v-row>
            </v-col>
          </v-row>
        </div>

        <!-- ValidateButton -->
        <v-row class="mt-0 pb-0">
          <action-button
              block
              :loading="loading"
              :handler="actionButton"
              :text="isCreating ? $tc('project_creation.confirm_button') : $tc('project_manage.change_settings_button')"
          />
        </v-row>
      </v-form>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import {projectNameRules} from "@/data/rules/ProjectRules";
import {colorRules} from "@/data/rules/ColorRules";
import Vue from "vue";
import Project from "@/data/models/api/Project";
import {languageNameRules} from "@/data/rules/LanguageRules";
import ImportItem from "@/data/models/ImportItem";

export default Vue.extend({
  name: "project-management",
  props: {project: Project, dialogOpened: Boolean},
  data() {
    return {
      fromImport: true,
      importItems: [new ImportItem("", null)] as ImportItem[],
      updatedProject: null as Project,
      writtenColor: "",
      languageName: "",
      colors: ["02188C", "EA1B32", "88B618", "FD6922", "17BFDB", "FFCF20", "7F5CE9", "B5B5B5"],
      projectNameRules: projectNameRules(),
      colorRules: colorRules(),
      languageRules: languageNameRules(),
      loading: false
    };
  },
  watch: {
    writtenColor() {
      if (/([A-Fa-f0-9]{6})$/i.test(this.writtenColor) === true) {
        this.updatedProject.color = this.writtenColor;
      }
    },
    dialogOpened: {
      immediate: true,
      handler: function (isOpened) {
        if (isOpened) {
          this.updatedProject = Project.map(this.project ?? {color: this.colors[0]});
          this.writtenColor = this.project?.color ?? this.colors[0];
          this.languageName = "";
        }
      }
    }
  },
  computed: {
    isCreating(): boolean {
      return !this.project;
    }
  },
  methods: {
    actionButton() {
      if (this.isCreating) {
        if (this.fromImport) {
          if ((this.$refs.formChangeSettings as Vue & { validate: () => boolean }).validate() === true) {
            this.loading = true;

            this.$service.projects.importProject(this.updatedProject, this.importItems)
                .then((project) => {
                  this.loading = false;

                  //this.closeManageProject();
                  //this.$router.push(`/projects/${project.id}`);
                })
                .catch(() =>
                    this.$notify(this.$t("errors.unknown_error").toString(), {color: "red"})
                )
                .finally(() => this.loading = false);
          }
        } else {
          this.createNewProject();
        }
      } else {
        this.update();
      }
    },
    update() {
      if ((this.$refs.formChangeSettings as Vue & { validate: () => boolean }).validate() === true) {
        this.loading = true;

        this.$service.projects.changeProjectSettings(this.updatedProject)
            .then(() => {
              this.$emit("projectUpdated", this.updatedProject);
              this.closeManageProject();
            })
            .catch((error) => this.$notify(this.$t(error).toString(), {color: "red"}))
            .finally(() => this.loading = false);
      }
    },
    createNewProject() {
      if ((this.$refs.formChangeSettings as Vue & { validate: () => boolean }).validate() === true) {
        this.loading = true;
        this.$service.projects.createProject(this.updatedProject, [this.languageName.toLowerCase()])
            .then((project) => {
              this.loading = false;
              this.closeManageProject();

              this.$router.push(`/projects/${project.id}`);
            })
            .catch(() => this.$notify(this.$t("errors.unknown_error").toString(), {color: "red"}))
            .finally(() => this.loading = false);
      }
    },
    closeManageProject() {
      this.$emit("close");
    },
    addImportItem() {
      this.importItems.push(new ImportItem("", null));
    }
  }
});
</script>

<style lang="scss" scoped>
.current-project-color {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

.button-color-picker-container {
  width: 50px;
  height: 32px;
}

.v-btn.button-color-picker {
  min-width: 50px !important;
  width: 100%;
  height: 100%;
}
</style>