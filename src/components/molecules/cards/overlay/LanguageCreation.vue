<template>
    <v-card color="white" class="pa-4 pa-md-7 card-style-project">

        <v-container>

            <!-- Title -->
            <v-row :style="{ 'height':'50px' }">
                <v-col cols="11" class="pl-0">
                    <p class="title-h2">
                    {{ $t("language_creation.title") }}
                    </p>
                </v-col>
                <v-col cols="1" class="pr-0">
                    <v-icon @click="closeLanguageCreation" color="black" class="float-right">
                        mdi-close
                    </v-icon>
                </v-col>
            </v-row>

            <keyboard-events :enter="createNewLanguage"/>
            <v-form ref="formCreateLanguage">
                <!-- Language name -->
                <v-row class="mt-4 pb-0 mb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <span class="title-h3">{{ $t('language_creation.language_name_title') }}</span>
                    </v-col>
                </v-row>
                <v-row class="mt-0">
                    <v-col cols="12" class="pb-0 pt-0 px-0">
                        <v-text-field autofocus :rules="languageNameRules" class="custom-text-field" background-color="#F2F3F7" v-model="languageName" :label="$t('language_creation.language_name_label')" solo flat required></v-text-field>
                    </v-col>
                </v-row>
                <!-- ValidateButton -->
                <v-row class="mt-0 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :loading="loading" :handler="createNewLanguage" :text="$t('language_creation.confirm_button')"/>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
    </v-card>
  
</template>

<script>
import ActionButton from "@/components/molecules/buttons/ActionButton";
import {languageNameRules} from "@/data/rules/LanguageRules";
import EventEnum from "@/data/enum/event-bus.enum";
import CardEnum from "@/data/models/Card.enum";
import KeyboardEvents from "../../KeyboardEvents.vue";

export default (
    'language-creation', {
    components: {
        ActionButton,
        KeyboardEvents
    },
    data: function() {
        return {
            loading: false,
            languageName: "",
            languageNameRules: languageNameRules(this.$t("rules.required"), this.$t("rules.language_name_length"), this.$t("rules.only_aphabetic_characters")),
            isBlockButton: true,
        }
    },
    methods: {
        createNewLanguage() {
            if (this.$refs.formCreateLanguage.validate() === true) {
                this.loading = true;
                this.$service.languages.createLanguage(this.$store.getters.actualProjectId, this.languageName)
                .then(() => {
                    this.loading = false;
                    this.$notify(this.$t("success.language_created"));
                    this.refreshLanguagesList();
                    this.closeLanguageCreation();
                }).catch((error) => {
                    if (error.response) {
                        switch (error.response.status) {
                            case 404:
                                this.reloadProject();
                                break;
                            case 403:
                                this.$notify(this.$t("errors.unauthorized"));
                                this.reloadProject();
                                break;
                            case 422:
                                this.$notify(this.$t("errors.language_already_exists"));
                                this.refreshLanguagesList();
                                break;
                        }
                    }
                }).finally(() => {
                    this.loading = false;
                    this.refreshKeysList();
                })
            }
        },
        refreshLanguagesList() {
            this.$eventBus.$emit(EventEnum.REFRESH_LANGUAGES_LIST);
        },
        refreshKeysList() {
            this.$eventBus.$emit(EventEnum.REFRESH_KEYS_LIST);
        },
        closeLanguageCreation() {
            this.$store.commit("SET_OPEN_CARD", CardEnum.NONE);
        },
        reloadProject() {
            this.$eventBus.$emit(EventEnum.ERROR_ACTION);
        }
    }
})

</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';
    .card-style-project {
        border-radius: 20px !important;
        width: 400px;
    }

</style>