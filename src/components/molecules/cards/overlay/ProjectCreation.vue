<template>
    <v-card width="100%" color="white" class="pa-4 pa-md-7 card-style-project">
        <v-container>
            <!-- Title -->
            <v-row :style="{ 'height':'50px' }">
                <v-col cols="11" class="px-0">
                    <p class="title-h2">{{ $t("project_creation.title") }}</p>
                </v-col>

                <v-col cols="1" class="pr-0">
                    <v-icon @click="closeCreationProject" color="black" class="float-right">mdi-close</v-icon>
                </v-col>
            </v-row>

            <keyboard-events :enter="createNewProject" />
            <v-form ref="formCreateProject">
                <!-- ProjectName -->
                <v-row class="mt-2 pb-0 mb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <span class="title-h3">{{ $t('project_creation.project_name_title') }}</span>
                    </v-col>
                </v-row>
                <v-row class="mt-0">
                    <v-col cols="12" class="pa-0">
                        <v-text-field class="custom-text-field" background-color="#F2F3F7" v-model="projectName" :rules="projectNameRules" :label="$t('project_creation.project_name_label')" solo flat required></v-text-field>
                    </v-col>
                </v-row>

                <!-- ProjectColor -->
                <v-row class="mt-0">
                    <v-col cols="12" class="pb-1 px-0">
                        <span class="title-h3">{{ $t('project_creation.color_title') }}</span>
                    </v-col>
                </v-row>

                <v-row class="my-2">
                    <v-col :style="{ 'height':'50px', 'background-color':'white' }" cols="7" class="pa-0">
                        <v-btn class="button-color-picker" :color='"#" + actualColor' width="100%" height="100%" depressed></v-btn>
                    </v-col>
                </v-row>

                <v-row class="my-2" justify="space-between">
                    <v-col v-for="color in colors" :key="color.color" :style="{ 'height':'30px', 'background-color':'white' }" cols="2" class="pb-0 pt-0 px-0">
                        <v-btn class="button-color-picker" :color='"#" + color.color' width="100%" height="100%" @click="actualColor = color.color; writtenColor = color.color" depressed></v-btn>
                    </v-col>
                </v-row>

                <v-row class="mt-2" justify="space-between">
                    <v-col cols="12" class="pa-0">
                        <v-text-field :rules="colorRules" class="custom-text-field" background-color="#F2F3F7" v-model="writtenColor" solo flat prefix="#"></v-text-field>
                    </v-col>
                </v-row>

                <!-- ProjectLanguage -->
                <v-row class="mt-2">
                    <v-col cols="12" class="pb-0 px-0">
                        <span class="title-h3">{{ $t('project_creation.language_name_title') }} <span class="text-2 grey-color"> {{ $t('common.optional') }}</span></span>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col class="py-0 px-0">
                        <v-text-field class="custom-text-field" background-color="#F2F3F7" v-model="projectLanguage" :rules="languageRules" :label="$t('project_creation.language_name_label')" solo flat></v-text-field>
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
                            background-color="#F2F3F7"
                            flat
                            solo
                            no-resize
                            rows="10"
                            class="custom-text-area"
                            :label="$t('project_creation.description_label')"
                            v-model="projectDescription"
                        ></v-textarea>
                    </v-col>
                </v-row>

                <!-- ValidateButton -->
                <v-row class="mt-0 pb-0">
                    <v-col cols="12" class="py-0 px-0">
                        <action-button block :loading="loading" :handler="createNewProject" :text="$t('project_creation.confirm_button')"/>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
    </v-card>
  
</template>

<script>
import ProjectCompact from "@/data/models/api/ProjectCompact";
import {projectNameRules} from "@/data/rules/ProjectRules";
import {colorRules} from "@/data/rules/ColorRules";
import {optionalLanguageRules} from "@/data/rules/LanguageRules";
import KeyboardEvents from "../../KeyboardEvents.vue";
import Vue from "vue";

export default Vue.extend({
    name: 'project-creation',
    components: {KeyboardEvents},
    props: {dialogOpened: Boolean},
    data: function () {
        return {
            loading: false,
            projectName: "",
            projectNameRules: projectNameRules(this.$t("rules.required"), this.$t("rules.project_name_length")),
            languageRules: optionalLanguageRules(this.$t("rules.language_name_length"), this.$t("rules.only_aphabetic_characters")),
            colorRules: colorRules(this.$t("rules.required"), this.$t("rules.color_length"), this.$t("rules.not_hexa_value")),
            isBlockButton: true,
            colorPicker: false,
            colors: [
                {color: "EA1B32"},
                {color: "183BB6"},
                {color: "67DA97"},
                {color: "FDC24E"},
                {color: "B662D3"},
            ],
            projectLanguage: null,
            actualColor: "309BD8",
            writtenColor: "309BD8",
            projectDescription: ""
        }
    },
    watch: {
        dialogOpened: {
            immediate: true,
            handler: function (isOpen) {
                if(isOpen) {
                    this.projectName = "";
                    this.actualColor = "";
                    this.projectDescription = "";
                }
            }
        },
        writtenColor() {
            this.updateColor();
        }
    },
    methods: {
        createNewProject() {
            if (this.$refs.formCreateProject.validate() === true) {
                this.loading = true;
                this.$service.projects.createProject({
                    name: this.projectName, 
                    color: this.actualColor, 
                    description: this.projectDescription},
                    this.projectLanguage)
                .then((response) => {
                    this.loading = false;
                    this.closeCreationProject();
                    this.$notify(this.$t("success.project_created").toString());
                    const newProject = ProjectCompact.map(response.data);
                    this.$router.push(`/projects/${newProject.id}`);
                }).catch(() => {
                    this.$notify(this.$t("errors.unknown_error").toString());
                }).finally(() => {
                    this.loading = false;
                })
            }
        },
        updateColor() {
            if (/([A-Fa-f0-9]{6})$/i.test(this.writtenColor) === true) {
                this.actualColor = this.writtenColor;
            }
        },
        closeCreationProject() {
            this.$emit("closeDelete");
        }
    }
})
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';
    .card-style-project {
        border-radius: 20px !important;
        width: 400px;
    }
    .title-style {
        font-weight: 500;
        font-size: 18px;
        line-height: 20px;
        letter-spacing: 0.05em;
        color: #000000;
    }
    .definition-style {
        font-size: 14px;
        line-height: 16px;
        letter-spacing: 0.05em;
        color: rgba(0, 0, 0, 0.3) !important;
    }
    .button-text {
        font-weight: 500;
        font-size: 16px;
        line-height: 18px;
        letter-spacing: 0.1em;
        color: #FFFFFF;
    }
    .field {
        color: black;
    }
    .button-color-picker {
        border-radius: 5px;
    }
    .button-color-picker.v-btn:not(.v-btn--round).v-size--default {
        min-width: 24px;
        min-height: 24px;
    }
    .custom-text-area .v-text-field--outlined, .v-text-field--solo {
        border-radius: 5px !important;
    }
    .custom-text-area textarea {
        overflow-y:hidden;
        resize: none;
        caret-color: black !important;
        color: black !important;
    }
    .custom-text-field .v-text-field__prefix {
        color: black !important;
    }

@media #{map-get($display-breakpoints, 'xs-only')} {
    .title-style {
        font-size: 14px;
    }
    .card-style-project {
        width: 100vw;
    }
    .button-text {
        font-size: 14px;
    }
}
</style>