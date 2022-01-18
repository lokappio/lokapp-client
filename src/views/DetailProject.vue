<template>
    <v-container fluid class="full-screen-container px-0 py-0 py-md-3">
        <left-nav-bar v-if="$vuetify.breakpoint.mdAndUp"/>
        <v-card class="card-style-content background-color-white px-6 pt-16 mr-0 ml-auto">

            <v-container v-if="!loading" class="ma-0 pa-0 full-contain card-container">
                <v-row class="ma-0 mb-4 row-header-style">
                    <header-banner :projectDetail="true"/>
                </v-row>

                <v-row class="ma-0 pl-0 pl-md-10  row-languages-style">
                    <languages-group/>
                </v-row>

                <v-row class="ma-0 px-8 pt-8 row-content-style">

                    <!-- Header -->
                    <v-row class="ma-0 header-row-detail-style">
                        <Header/>
                    </v-row>

                    <!-- Keys/Values -->
                    <v-row class="ma-0 keys-row-detail-style">
                        <content-details/>
                    </v-row>
                </v-row>

            </v-container>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import {Vue} from "vue-property-decorator";
import LeftNavBar from "@/components/molecules/LeftNavBar.vue";
import HeaderBanner from "@/components/molecules/dashboard/HeaderWithBanner.vue";
import LanguagesGroup from "@/components/molecules/project/LanguagesGroup.vue";
import Header from "@/components/molecules/project/Header.vue";
import ContentDetails from "@/components/molecules/project/ContentDetails.vue";
import {MetaInfo} from "vue-meta";
import Project from "@/data/models/api/Project";

export default Vue.extend({
    name: "DetailProject",
    metaInfo(): MetaInfo {
        return {
            title: this.currentProject.name ?? "",
            titleTemplate: `Lokapp - %s`
        };
    },
    components: {
        LeftNavBar,
        HeaderBanner,
        LanguagesGroup,
        Header,
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
                    this.$notify(this.$t("errors.retrieve_project").toString());
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
@import '~vuetify/src/styles/styles.sass';

.full-screen-container {
    background-color: #02188C;
    width: 100vw;
    height: 100vh;
}

.card-style-content {
    width: 92vw;
    height: 100%;
    border-top-left-radius: 15px !important;
    border-bottom-left-radius: 15px !important;
    border-top-right-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
}

.card-container {
    border-bottom-left-radius: 0px !important;
    max-width: 100%;
}

.row-header-style {
    height: 10%;
    width: 100%;
}

.row-content-style {
    background-color: #FAF8F9;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
    height: calc(85% - 4 * 4px);
    width: 100%;
}

.row-languages-style {
    width: 100%;
    height: 5%;
}

.header-row-detail-style {
    width: 100%;
    height: 15%;
}

.keys-row-detail-style {
    width: 100%;
    height: 85%;
}

@media #{map-get($display-breakpoints, 'sm-and-down')} {
    .card-style-content {
        width: 100vw;
        border-top-left-radius: 0px !important;
        border-bottom-left-radius: 0px !important;
    }
    .search-bar-height {
        height: 40%;
    }
}
</style>