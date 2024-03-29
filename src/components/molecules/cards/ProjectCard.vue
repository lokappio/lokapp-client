<template>
  <div class="fill-height">
    <v-dialog v-model="dialogOpened" max-width="800px">
      <ProjectManagement :dialog-opened="dialogOpened" @close="() => this.dialogOpened = false"/>
    </v-dialog>

    <v-card v-if="project" class="py-2 pl-2 pr-3 custom-cards-project">
      <v-row no-gutters @click="openProjectView" class="fill-height">
        <v-col cols="3" class="set-cursor-pointer fill-height">
          <div class="div-text-center-container" :style="{ 'background-color':'#' + this.currProject.color }">
            <div class="div-text-center-content project-letter">{{firstCharProjectName}}</div>
          </div>
        </v-col>

        <v-col cols="8" class="set-cursor-pointer pl-3 fill-height">
            <div class="title-style mb-2 pt-1 title-h3">{{ currProject.name }}</div>
            <p class="description-style">{{ currProject.description }}</p>
        </v-col>

        <v-col cols="1" class="fill-height">
          <project-settings-button :project="currProject" :from-store="false" @update_projects="updateProject" @projectDeleted="() => $emit('projectDeleted')"/>
        </v-col>
      </v-row>
    </v-card>

    <!-- CREATE PROJECT BTN -->
    <v-card v-else class="fill-height custom-cards-project empty set-cursor-pointer" @click="openCreateProject">
      <v-row no-gutters align="center" justify="center" class="fill-height">
        <v-icon color="primary" large>mdi-plus-circle</v-icon>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import {firstChar} from "@/data/helpers/stringFormatting";
import ProjectSettingsButton from "@/components/molecules/buttons/ProjectSettingsButton.vue";
import Vue from "vue";
import Project from "@/data/models/api/Project";
import ProjectManagement from "@/components/molecules/cards/overlay/ProjectManagement.vue";

export default Vue.extend(
    {
      name: "project-card",
      components: {ProjectManagement, ProjectSettingsButton},
      props: {project: Project},
      data() {
        return {
          //  USED TO REFRESH VALUES OF PROJECT WHEN PARAMETERS UPDATED FROM ProjectSettingsButton
          currProject: this.project,
          dialogOpened: false
        };
      },
      computed: {
        firstCharProjectName(): string {
          return firstChar(this.currProject?.name);
        }
      },
      methods: {
        openProjectView() {
          this.$store.commit("SET_CURRENT_PROJECT", this.project);
          this.$router.push(`/projects/${this.project.id}`);
        },
        openCreateProject() {
          this.dialogOpened = true;
        },
        updateProject(project: Project) {
          //WHEN PROJECT UPDATED FROM ProjectSettingsButton > ProjectManagement
          this.currProject = Project.map(project);
        }
      }
    });
</script>

<style lang="scss" scoped>
.custom-cards-project {
  border-radius: 20px !important;
  box-shadow: 0 4px 4px rgba(203, 203, 203, 0.25) !important;
  height: 120px;
}

.empty {
  border: 2px dashed var(--v-primary-base) !important;
}

.div-text-center-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  height: 100%;
}

.div-text-center-content {
  font-weight: 500;
  color: white;
  font-size: 40px;
}

.project-letter {
  padding-top: 0.2em;
}

.title-style {
  height: 20%;
}

.description-style {
  text-overflow: ellipsis;
  overflow: hidden;
  height: 70%;
}

.v-card--link:before {
  border-radius: 20px;
}
</style>