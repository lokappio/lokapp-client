
<template>

    <v-card v-if="project" class="pa-2 card-project-style full-contain background-color-white">
        <v-container class="full-contain full-container pa-0">
            <v-row class="ma-0 pa-1 full-row round-corner-row full-contain background-color-white">
                <v-col cols="3" @click="openProjectView" class="pa-0 full-row set-cursor-pointer">
                    <div class="round-corner-row title-h1 full-contain div-text-contain-center" :style="{ 'background-color':'#' + this.project.color }">
                        {{ getInitial(this.project.name) }}
                    </div>
                </v-col>
                <v-col cols="8" @click="openProjectView" class="pr-0 full-row set-cursor-pointer">
                    <div class="mb-2 pt-1 text-truncate title-h3">{{project.name}}</div>
                    <p class="description-style mb-0">{{project.description}}</p>
                </v-col>
                <v-col cols="1" class="pa-0">
                    
                    <project-settings-button :projectId="project.id"/>

                </v-col>
            </v-row>
        </v-container>
    </v-card>
    <v-card v-else elevation="0" class="pa-0 card-project-style full-contain empty set-cursor-pointer no-click-effect" @click="openCreateProject" :ripple="false">
        <v-row align="center" justify="center" class="ma-0 full-row">
            <v-icon color="maincolor" class="full-contain" large>mdi-plus-circle</v-icon>
        </v-row>
    </v-card>

</template>

<script>
import ProjectList from "@/data/models/api/ProjectList";
import {getInitialOfString} from "@/data/formatting/StringFormatting";
import ProjectSettingsButton from "@/components/molecules/buttons/ProjectSettingsButton";
import CardEnum from "@/data/models/Card.enum";

export default (
    'project-small', {
    components: {
        ProjectSettingsButton
    },
    props: {
        project: ProjectList,
    },
    methods: {
        openProjectView() {
            this.$store.commit('SET_OPEN_CARD', CardEnum.NONE)
            this.$store.commit('SET_ACTUAL_PROJECT_ID', this.project.id);
            this.$router.push(`/projects/${this.project.id}`);
        },
        getInitial(projectName) {
            return getInitialOfString(projectName);
        },
        openCreateProject() {
            this.$store.commit('SET_OPEN_CARD', CardEnum.CREATE_PROJECT);
        }
    }
})
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';
    .card-project-style.v-sheet.v-card{
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
    .full-contain-icon {
        width: 100% !important;
    }
    .empty {
        box-sizing: border-box;
        width: 10000px;
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