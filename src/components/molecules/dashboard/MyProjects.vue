<template>
  <v-container fluid class="my-projects-container pa-0">
    <!-- Header -->
    <div class="header ml-5">
      <h2 class="title-h2">{{ this.$t("dashboard.all_projects_title") }}</h2>
      <p class="text-2 grey--text d-block">{{ this.$tc("dashboard.last_update", timerUpdate, {count: timerUpdate}) }}</p>
    </div>

    <!-- Projects -->
    <v-row no-gutters class="mt-3 content">
      <v-col v-if="loading" cols="12" class="text-center">
        <v-progress-circular color="primary" indeterminate></v-progress-circular>
      </v-col>

      <v-col v-else cols="12" class="projects-container-style">
        <v-row class="ma-0 mr-3" v-if="displayedProjects.length">
          <v-col
              v-for="project in displayedProjects"
              :key="project.id"
              cols="12" sm="6" md="4" lg="3" xl="2"
          >
            <ProjectCard :project="project" @projectDeleted="() => $emit('projectDeleted')"/>
          </v-col>

          <!-- CREATING PROJECT BUTTON -->
          <v-col cols="12" sm="6" md="4" lg="3" xl="2">
            <ProjectCard/>
          </v-col>
        </v-row>

        <v-row no-gutters v-else class="ma-5">
          <!-- CREATING PROJECT BUTTON -->
          <v-col cols="12" sm="6" md="4" lg="3" xl="2">
            <ProjectCard />
          </v-col>
        </v-row>
      </v-col>

    </v-row>
  </v-container>
</template>

<script lang="ts">
import ProjectCard from "../cards/ProjectCard.vue";
import Vue from "vue";
import Project from "@/data/models/api/Project";

export default Vue.extend({
  name: "my-projects",
  components: {ProjectCard},
  props: {projects: [], loading: Boolean},
  data() {
    return {
      timerUpdate: 0,
      totalSecondes: 0,
      timer: null,
    };
  },
  watch : {
    projects() {
      this.updateMyTimer();
    }
  },
  computed: {
    searchProjectValue(): string {
      return this.$store.state.searchProject;
    },
    displayedProjects(): Project[] {
      return (this.projects as Project[]).filter((project) => project.name.toUpperCase().includes(this.searchProjectValue.toUpperCase()));
    }
  },
  methods: {
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
.my-projects-container {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: var(--v-background-base);
  height: 100%;
}

.header {
  margin-top: 30px;
  height: 50px;
}

.projects-container-style {
  height: 100%;
  overflow-y: scroll;
}
</style>
