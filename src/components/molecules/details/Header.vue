<template>
    <v-container class="full-contain pa-0 ma-0 my-full-container">
        <v-row class="full-contain ma-0">

            <!-- LeftPart -->
            <v-col cols="6">
                <div>
                    <span class="title-h2 detail-project-name-title">
                        {{projectName}}
                    </span>
                    <project-settings-button :projectId="projectId"/>
                    <br/>
                    <p class="text-2 detail-project-description">
                        {{projectDescription}}
                    </p>
                </div>
            </v-col>

            <v-col cols="1" class="pr-0 pl-auto">
                <v-btn @click="openDownloadProject" color="maincolor" class="download-button">
                    <v-icon color="white">
                        mdi-download
                    </v-icon>
                </v-btn>
            </v-col>

            <!-- RightPart -->
            <v-col cols="5">
                <header-search-bar noRing/>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import HeaderSearchBar from "@/components/molecules/header/HeaderSearchBar";
import ProjectSettingsButton from "@/components/molecules/buttons/ProjectSettingsButton.vue";
import CardEnum from "@/data/models/Card.enum";
import EventEnum from "@/data/enum/event-bus.enum";

export default (
    'detail-header', {
    components: {
        HeaderSearchBar,
        ProjectSettingsButton
    },
    created() {
        this.projectId = this.$store.getters.actualProjectId;
        this.$service.projects.getSpecificProject(this.projectId)
        .then(project => {
            this.projectName = project.name;
            this.projectDescription = project.description;
        }).catch(() => {
            this.$eventBus.$emit(EventEnum.ERROR_GET_SOMETHING);
        })
    },
    methods: {
        openDownloadProject() {
            this.$store.commit("SET_OPEN_CARD", CardEnum.DOWNLOAD_PROJECT);
        }
    },
    data: function() {
        return {
            projectName: "",
            projectDescription: "",
            projectId: -1
        }
    },
    
})
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';
    .my-full-container {
        max-width: 100%;
    }
    .detail-project-name-title {
        color: #02188C;
    }
    .detail-project-description {
        color: grey;
        max-height: calc(16px * 3);
        overflow: hidden;
    }
    .download-button {
        width: 50px !important;
        min-width: 50px !important;
        height: 50px !important;
        max-height: 50px !important;
        float: right;
    }
</style>