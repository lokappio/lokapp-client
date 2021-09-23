

<template>

    <!-- Modification of project -->
    <v-card color="white" class="pa-4 pa-md-7 card-style-project">
        <v-container>

            <!-- Title -->
            <v-row :style="{ 'height':'50px' }">
                <v-col cols="11" class="px-0">
                    <h2 class="title-h2">
                    {{ this.$t("project_manage.title") }}
                    </h2>
                </v-col>
                <v-col cols="1" class="pr-0">
                    <v-icon @click="closeManageProject" color="black" class="float-right">
                        mdi-close
                    </v-icon>
                </v-col>
            </v-row>
            <v-form ref="formChangeSettings">
                <!-- ProjectName -->
                <v-row class="mt-2 pb-0 mb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <span class="title-h3">{{ $t('project_creation.project_name_title') }}</span>
                    </v-col>
                </v-row>
                <v-row class="mt-0">
                    <v-col cols="12" class="pa-0">
                        <v-text-field :disabled="!modificationActivated" class="custom-text-field" background-color="#F2F3F7" v-model="projectName" :rules="projectNameRules" :label="$t('project_creation.project_name_label')" solo flat required></v-text-field>
                    </v-col>
                </v-row>

                <!-- ProjectColor -->
                <v-row class="mt-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <span class="title-h3">{{ $t('project_creation.color_title') }}</span>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col :style="{ 'height':'50px', 'background-color':'white' }" cols="7" class="pa-0">
                        <v-btn class="button-color-picker" :color="'#' + `${actualColor}`" width="100%" height="100%" depressed>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row v-if="modificationActivated" class="pt-4" justify="space-between">
                    <v-col v-for="color in colors" :key="color.color" cols="2" class="pb-0 pt-0 px-0">
                        <v-btn class="button-color-picker" :color="'#' + `${color.color}`" width="100%" height="100%" @click="() => {if (modificationActivated) {actualColor = color.color; writtenColor = color.color;}}" depressed>
                        </v-btn>
                    </v-col>
                </v-row>
                <v-row v-if="modificationActivated" class="pt-3" justify="space-between">
                    <v-col cols="12" class="pa-0">
                        <v-text-field :rules="colorRules" class="custom-text-field" background-color="#F2F3F7" v-model="writtenColor" solo flat prefix="#"></v-text-field>
                    </v-col>
                </v-row>

                <!-- DescriptionProject -->
                <v-row class="mt-2 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <span class="title-h3">{{ $t('project_creation.description_title') }} <span class="text-2 grey-color"> {{ $t('common.optional') }}</span></span>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="py-0 px-0">
                        <v-textarea
                            :disabled="!modificationActivated"
                            background-color="#F2F3F7"
                            flat
                            solo
                            no-resize
                            rows="10"
                            class="custom-text-area"
                            v-model="projectDescription"
                        ></v-textarea>
                    </v-col>
                </v-row>

                <!-- ValidateButton -->
                <v-row v-if="!modificationActivated" class="mt-0 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :loading="loading" :handler="changeSettings" :text="$t('project_manage.change_settings_button')"/>
                    </v-col>
                </v-row>
                <v-row v-if="modificationActivated" class="mt-0 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :loading="loading" :handler="validateSettings" :text="$t('project_manage.validate_settings_button')"/>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
    </v-card>
</template>

<script>
import ActionButton from "@/components/molecules/buttons/ActionButton";
import DeprecatedButton from "@/components/molecules/buttons/DeprecatedButton";
import {projectNameRules} from "@/data/rules/ProjectRules";
import {colorRules} from "@/data/rules/ColorRules";
import CardEnum from "@/data/models/Card.enum";
import { Vue, Component } from "vue-property-decorator";
import EventEnum from "@/data/enum/event-bus.enum";

@Component({
    components: { 
        ActionButton,
        DeprecatedButton
    },
})
export default class ProjectManagement extends Vue {
    name = 'project-management';

    created() {
        this.projectId = this.$store.getters.actualProjectId;
        this.refreshProject();
    }
    data() {
        return {
            project: null,
            title: "",
            projectId: this.$store.getters.actualProjectId,
            colors: [
                {color: "EA1B32"},
                {color: "183BB6"},
                {color: "67DA97"},
                {color: "FDC24E"},
                {color: "B662D3"},
            ],
            actualColor: "309BD8",
            writtenColor: "309BD8",

            projectName: "",
            projectNameRules: projectNameRules(this.$t("rules.required"), this.$t("rules.project_name_length")),
            colorRules: colorRules(this.$t("rules.required"), this.$t("rules.color_length"), this.$t("rules.not_hexa_value")),
            projectDescription: "",
            loading: false,
            modificationActivated: false,
        }
    }
    updateColor() {
        if (/([A-Fa-f0-9]{6})$/i.test(this.writtenColor) === true) {
            this.actualColor = this.writtenColor;
        }
    }
    changeSettings() {
        this.modificationActivated = !this.modificationActivated;
    }
    refreshProject() {
        this.$service.projects.getSpecificProject(this.projectId)
        .then(project => {
            this.project = project;
            this.projectName = this.project.name;
            this.actualColor = this.project.color;
            this.writtenColor = this.project.color;
            this.projectDescription = this.project.description;
        }).catch(() => {
            this.$eventBus.$emit(EventEnum.ERROR_GET_SOMETHING);
        });
    }
    validateSettings() {
        if (this.$refs.formChangeSettings.validate() === true) {
            this.loading = true;
            this.$service.projects.changeProjectSettings(this.projectId, this.projectName, this.actualColor, this.projectDescription)
            .then(() => {
                this.$notify(this.$t("success.project_updated"));
                this.refreshProject();
            }).catch((error) => {
                if (error.response) {
                    switch (error.response.status) {
                        case 403:
                            this.$notify(this.$t("error.unauthorized"));
                            break;
                    }
                    this.$eventBus.$emit(EventEnum.ERROR_ACTION);
                }
            }).finally(() => {
                this.loading = false;
                this.modificationActivated = false;
            });
        }
    }
    closeManageProject() {
        this.$store.commit("SET_OPEN_CARD", CardEnum.NONE);
        this.$eventBus.$emit(EventEnum.REFRESH_PROJECTS_LIST);
    }
    watch() {
        this.writtenColor = () => {
            this.updateColor();
        }
    }
}
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