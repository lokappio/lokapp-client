<template>
  <v-container fluid class="full-screen-container px-0">
    <v-row class="fill-height" no-gutters>
      <v-col cols="auto">
        <left-nav-bar/>
      </v-col>

      <v-col>
        <v-card class="box card-style-content background-color-white fill-height px-5 pt-5">
          <template v-if="!loading">
            <div class="row header">
              <header-banner projectDetail/>
            </div>

            <div class="row content">
              <languages-group/>
              <content-details/>
            </div>
          </template>

          <template v-else>
            <v-row no-gutters>
              <v-col cols="12" class="text-center">
                <v-progress-circular color="primary" indeterminate></v-progress-circular>
              </v-col>
            </v-row>
          </template>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {Vue} from "vue-property-decorator";
import LeftNavBar from "@/components/molecules/LeftNavBar.vue";
import HeaderBanner from "@/components/molecules/dashboard/HeaderWithBanner.vue";
import LanguagesGroup from "@/components/molecules/project/LanguagesGroup.vue";
import ContentDetails from "@/components/molecules/project/ContentDetails.vue";
import {MetaInfo} from "vue-meta";
import Project from "@/data/models/api/Project";

export default Vue.extend({
  name: "DetailProject",
  metaInfo(): MetaInfo {
    return {
      title: this.currentProject?.name ?? "",
      titleTemplate: `Lokapp - %s`
    };
  },
  components: {
    LeftNavBar,
    HeaderBanner,
    LanguagesGroup,
    ContentDetails
  },
  data() {
    return {
      loading: true
    };
  },
  created() {
    this.loadProject();
  },
  computed: {
    currentProject(): Project {
      return this.$store.state.currentProject;
    }
  },
  methods: {
    loadProject() {
      this.loading = true;

      this.$service.projects.getEntireProjectById(parseInt(this.$route.params.project_id))
          .then(async (project: Project) => {
            this.$store.commit("SET_CURRENT_PROJECT", project);
            await this.updateMyRole(project.id);
            this.loading = false;
          })
          .catch(() => {
            this.$notify(this.$t("errors.retrieve_project").toString(), {color: "red"});
            this.$store.commit("SET_CURRENT_PROJECT", null);
            this.backToDashboard();
          });
    },
    async updateMyRole(projectId: number): Promise<void> {
      return this.$service.user.getMyselfInProject(projectId).then((user) => this.$store.commit("SET_APP_USER", user));
    },
    backToDashboard() {
      this.$router.push({path: "/dashboard"});
    }
  }
});
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/settings/_variables';

.full-screen-container {
  background-color: var(--v-primary-base);
  width: 100vw;
  height: 100vh;
}

.row {
  margin-bottom: 0 !important;
  margin-left: 12px;
}

.row.header {
  height: 120px;
}

.row.content {
  position: absolute;
  top: 120px;
  bottom: 0;
  width: 100%;
  padding-right: 12px;
}


.card-style-content {
  border-radius: 15px 0 0 15px !important;
}

</style>