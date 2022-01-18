<template>
    <div class="full-contain">
        <v-dialog v-model="dialogOpened" max-width="500px">
            <ProjectCreation :dialog-opened="dialogOpened" @closeDelete="() => this.dialogOpened = false"/>
        </v-dialog>

        <v-card v-if="project" class="pa-2 card-project-style full-contain background-color-white">
            <v-container class="full-contain full-container pa-0">
                <v-row @click="openProjectView" class="ma-0 pa-1 full-row round-corner-row full-contain background-color-white">
                    <v-col cols="3" class="pa-0 full-row set-cursor-pointer">
                        <div class="round-corner-row title-h1 full-contain div-text-contain-center" :style="{ 'background-color':'#' + this.project.color }">
                            {{ firstCharProjectName }}
                        </div>
                    </v-col>

                    <v-col cols="8" class="pr-0 full-row set-cursor-pointer">
                        <div class="mb-2 pt-1 text-truncate title-h3">{{ project.name }}</div>
                        <p class="description-style mb-0">{{ project.description }}</p>
                    </v-col>

                    <v-col cols="1" class="pa-0">
                        <project-settings-button :projectId="project.id"/>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>

        <!-- CREATE PROJECT BTN -->
        <v-card v-else elevation="0" class="pa-0 card-project-style full-contain empty set-cursor-pointer no-click-effect" @click="openCreateProject" :ripple="false">
            <v-row align="center" justify="center" class="ma-0 full-row">
                <v-icon color="maincolor" class="full-contain" large>mdi-plus-circle</v-icon>
            </v-row>
        </v-card>
    </div>
</template>

<script lang="ts">
import {firstChar} from "@/data/helpers/stringFormatting";
import ProjectSettingsButton from "@/components/molecules/buttons/ProjectSettingsButton.vue";
import Vue from "vue";
import Project from "@/data/models/api/Project";
import ProjectCreation from "@/components/molecules/cards/overlay/ProjectCreation.vue";

export default Vue.extend(
    {
        name: "project-card",
        components: {ProjectCreation, ProjectSettingsButton},
        props: {project: Project},
        data() {
            return {
                dialogOpened: false,
            }
        },
        computed: {
          firstCharProjectName(): string {
              return firstChar(this.project?.name);
          }
        },
        methods: {
            openProjectView() {
                //this.$store.commit("SET_CURRENT_PROJECT", this.project);
                this.$router.push(`/projects/${this.project.id}`);
            },
            openCreateProject() {
                this.dialogOpened = true;
            }
        }
    });
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';

.card-project-style.v-sheet.v-card {
    border-radius: 20px;
}

.full-container {
    max-width: 100%;
    max-height: 100%;
}

.full-row {
    height: 100%;
    max-height: 100%;
}

.round-corner-row {
    border-radius: 11px;
}

.description-style {
    font-size: 0.65rem;
    line-height: 16px;
    color: #1A1A1A;
    letter-spacing: 0.05em;
    max-height: calc(16px * 3);
    overflow: hidden;
}

.empty {
    box-sizing: border-box;
    border: 2px dashed rgba(1, 15, 92, 0.3) !important;
    background-color: transparent !important;
}

.div-text-contain-center {
    text-align: center;
    vertical-align: middle;
    height: 100%;
    line-height: 100px;
    color: white;
    font-size: 40px;
}

.set-cursor-pointer {
    cursor: pointer;
}

.v-card--link:before {
    border-radius: 20px;
}
</style>