<template>
    <v-card color="white" class="pa-4 pa-md-7 custom-cards">
        <!-- Title and close -->
        <v-icon @click="comebackToLanguageManagement" color="black" class="float-right">
            mdi-close
        </v-icon>
        <v-card-title class="title-style d-flex justify-space-around">
            {{ $t("language_delete.title") }}
        </v-card-title>

        <!-- Confirmation text -->
        <v-card-text class="pb-0">
            <div class="field text-center">
                {{ $t("language_delete.description_1", {"value": language.name}) }}
            </div>
            <div class="field text-center">
                {{ $t("language_delete.description_2") }}
            </div>
        </v-card-text>

        <!-- Buttons -->
        <v-card-actions>
            <v-container class="pa-0">
                <v-row class="mt-0 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :loading="loading" :handler="deleteLanguage" :text="$t('language_delete.confirm_button')"/>
                    </v-col>
                </v-row>
                <v-row class="mt-2 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :loading="loading" :handler="comebackToLanguageManagement" :text="$t('language_delete.cancel_button')"/>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Language from "@/data/models/api/Language";

export default Vue.extend({
    name: "language-delete",
    props: {
        language: Language,
        projectId: Number,
        dialogOpened: Boolean
    },
    data() {
        return {
            loading: false
        };
    },
    methods: {
        comebackToLanguageManagement() {
            this.$emit("closeDelete");
        },
        deleteLanguage() {
            this.loading = true;

            this.$service.languages.deleteLanguage(this.language.id, this.projectId)
                .then(() => {
                    this.$store.commit("DELETE_PROJECT_LANGUAGE", this.language);
                    this.comebackToLanguageManagement();
                })
                .catch((error) => this.$notify(this.$t(error).toString(), {color: "red"}))
                .finally(() => this.loading = false);
        }
    }
});
</script>