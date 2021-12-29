<template>
    <v-container class="my-projects-container full-contain">
        <!-- Header -->
        <v-row class="ma-0 align-center title-row-style">
            <p class="ma-0 ml-4">
                <span class="title-h2">{{ this.$t("dashboard.all_projects_title") }}</span> <br/>
                <span class="text-2 grey-color">{{ this.$tc("dashboard.last_update", timerUpdate, {count: timerUpdate}) }}</span>
            </p>
        </v-row>

        <!-- Projects -->
        <v-row class="ma-0 projects-row-style">
            <v-container class="full-contain projects-container-style">

                <!-- If Projects Loaded -->
                <template v-if="displayedProjects.length">
                    <v-row justify="center" justify-sm="start" class="py-auto project-row-style">
                        <!-- MY PROJECTS -->
                        <v-col
                            v-for="project in displayedProjects"
                            :key="project.id"
                            cols="12" sm="6" md="4" lg="3" xl="2"
                            class="project-card-col"
                        >
                            <ProjectCard :project="project"/>
                        </v-col>

                        <!-- ADD PROJECT ITEM -->
                        <v-col cols="12" sm="6" md="4" lg="3" xl="2" class="project-card-col">
                            <ProjectCard />
                        </v-col>
                    </v-row>
                </template>

                <!-- Else -->
                <template v-else>
                    <v-row align-content="end" justify="center" class="middle-row my-0 mx-auto">
                        <p><span class="title-h3">{{ $t("dashboard.no_project_in_dashboard") }}</span></p>
                    </v-row>
                    <!-- ADD PROJECT -->
                    <ProjectCard />
                </template>
            </v-container>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import ProjectCard from "../cards/ProjectCard.vue";
import EventEnum from "@/data/enum/event-bus.enum";
import Vue from "vue";
import Project from "@/data/models/api/Project";
import ProjectCompact from "@/data/models/api/ProjectCompact";

export default Vue.extend({
    name: "my-projects",
    components: {ProjectCard},
    created() {
        this.refreshProjectList();
    },
    data() {
        return {
            projects: [] as Project[],
            timerUpdate: 0,
            totalSecondes: 0,
            timer: null,
            loading: false,
            text: this.$t("dashboard.add_project")
        };
    },
    computed: {
        searchProjectValue(): string {
            return this.$store.state.searchProject;
        },
        displayedProjects(): Project[] {
          return this.projects.filter((project) => project.name.toUpperCase().includes(this.searchProjectValue.toUpperCase()))
        }
    },
    methods: {
        refreshProjectList() {
            this.$service.projects.getProjects()
                .then(projects => {
                    this.projects = projects;
                    this.updateMyTimer();
                });
            },
        updateMyTimer() {
            this.totalSecondes = 0;
            this.timerUpdate = 0;
            clearInterval(this.timer);
            this.timer = setInterval(() => this.timerUpdate = Math.floor(++this.totalSecondes / 60), 1000);
        }
    }
});
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';

.my-projects-container {
    max-width: 100%;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
}

.title-row-style {
    height: 15%;
    width: 100%;
}

.projects-row-style {
    height: 85%;
    width: 100%;
}

.projects-container-style {
    max-width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
}

.middle-row {
    height: 50%;
}

.project-row-style {
    height: 130px;
}

.project-card-col {
    height: 120px;
    padding: 0px;
    padding-right: 10px;
    padding-left: 10px;
    margin-bottom: 10px;
    margin-top: 15px;
    border-radius: 5px;
}
</style>