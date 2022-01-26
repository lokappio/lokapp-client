<template>
  <!-- Modification of project -->
  <v-card color="white" width="100%" class="pa-4 pa-md-7 card-style-project">
    <v-container>
      <!-- Title -->
      <v-row :style="{ 'height':'50px' }">
        <v-col cols="11" class="px-0">
          <h2 class="title-h2">{{ this.$t("project_manage.title") }}</h2>
        </v-col>

        <v-col cols="1" class="pr-0">
          <v-icon @click="closeManageProject" color="black" class="float-right">mdi-close</v-icon>
        </v-col>
      </v-row>

      <v-form ref="formChangeSettings">
        <!-- ProjectName -->
        <v-row class="mt-2 pb-0 mb-0">
          <v-col cols="12" class="pb-0 px-0">
            <span class="title-h3">{{ $t("project_creation.project_name_title") }}</span>
          </v-col>
        </v-row>

        <v-row class="mt-0">
          <v-col cols="12" class="pa-0">
            <v-text-field class="custom-text-field" background-color="#F2F3F7" v-model="updatedProject.name" :rules="projectNameRules" :label="$t('project_creation.project_name_label')" solo flat
                          required></v-text-field>
          </v-col>
        </v-row>

        <!-- ProjectColor -->
        <v-row class="mt-0">
          <v-col cols="12" class="pb-0 px-0">
            <span class="title-h3">{{ $t("project_creation.color_title") }}</span>
          </v-col>
        </v-row>

        <v-row>
          <v-col :style="{ 'height':'50px', 'background-color':'white' }" cols="7" class="pa-0">
            <v-btn class="button-color-picker" :color="'#' + `${updatedProject.color}`" width="100%" height="100%" depressed></v-btn>
          </v-col>
        </v-row>

        <v-row class="pt-4" justify="space-between">
          <v-col v-for="color in colors" :key="color.color" cols="2" class="pb-0 pt-0 px-0">
            <v-btn class="button-color-picker" :color="'#' + `${color.color}`" width="100%" height="100%" @click="() => {updatedProject.color = color.color; this.writtenColor = color.color;}"
                   depressed></v-btn>
          </v-col>
        </v-row>

        <v-row class="pt-3" justify="space-between">
          <v-col cols="12" class="pa-0">
            <v-text-field :rules="colorRules" class="custom-text-field" background-color="#F2F3F7" v-model="writtenColor" solo flat prefix="#"></v-text-field>
          </v-col>
        </v-row>

        <!-- DescriptionProject -->
        <v-row class="mt-2 pb-0">
          <v-col cols="12" class="pb-0 px-0">
            <span class="title-h3">{{ $t("project_creation.description_title") }} <span class="text-2 grey-color"> {{ $t("common.optional") }}</span></span>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="py-0 px-0">
            <v-textarea
                background-color="#F2F3F7"
                flat
                solo
                no-resize
                rows="10"
                class="custom-text-area"
                v-model="updatedProject.description"
            ></v-textarea>
          </v-col>
        </v-row>

        <!-- ValidateButton -->
        <v-row class="mt-0 pb-0">
          <v-col cols="12" class="pb-0 px-0">
            <action-button block :loading="loading" :handler="update" :text="$t('project_manage.change_settings_button')"/>
          </v-col>
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

export default Vue.extend({
  name: "project-management",
  props: {project: Project, dialogOpened: Boolean},
  data() {
    return {
      updatedProject: null as Project,
      writtenColor: "",

      colors: [
        {color: "EA1B32"},
        {color: "183BB6"},
        {color: "67DA97"},
        {color: "FDC24E"},
        {color: "B662D3"}
      ],

      projectNameRules: projectNameRules(),
      colorRules: colorRules(),
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
          this.updatedProject = Project.map(this.project);
          this.writtenColor = this.project.color;
        }
      }
    }
  },
  methods: {
    update() {
      if ((this.$refs.formChangeSettings as Vue & { validate: () => boolean }).validate() === true) {
        this.loading = true;

        this.$service.projects.changeProjectSettings(this.updatedProject)
            .then(() => {
              this.$notify(this.$t("success.project_updated").toString());
              this.$emit("projectUpdated", this.updatedProject);
              this.closeManageProject();
            })
            .catch((error) => {
              if (error.response) {
                switch (error.response.status) {
                  case 403:
                    this.$notify(this.$t("error.unauthorized").toString());
                    break;
                }
              }
            })
            .finally(() => {
              this.loading = false;
            });
      }
    },
    closeManageProject() {
      this.$emit("close");
    }
  }
});
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';

.card-style-project {
  border-radius: 20px !important;
  width: 400px;
}

.overflow-container-languages {
  max-height: 250px;
  overflow-y: scroll;
}

.custom-text-field::v-deep .v-text-field__prefix {
  color: black !important;
}

.custom-text-area::v-deep .v-input__slot {
  caret-color: black !important;
}

//Display the scrollbar permanently on mac
::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 7px;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, .5);
  box-shadow: 0 0 1px rgba(255, 255, 255, .5);
}
</style>