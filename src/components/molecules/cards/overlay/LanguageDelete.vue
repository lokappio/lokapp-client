<template>
    <v-card color="white" class="pa-4 pa-md-7 card-style-project">

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
            {{ $t("language_delete.description_1", { "value": language.name }) }}
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
import EventEnum from "@/data/enum/event-bus.enum";
import CardEnum from '@/data/models/Card.enum';
import ActionButton from "@/components/molecules/buttons/ActionButton.vue";
import Vue from 'vue'

export default Vue.extend({
    name: "language-delete",
    components: {
        ActionButton
    },
    data() {
        return {
            loading: false,
            language: this.$store.getters.actualLanguage
        }
    },
    methods: {
        comebackToLanguageManagement() {
            this.$store.commit("SET_OPEN_CARD", CardEnum.MANAGE_LANGUAGE);
        },
        deleteLanguage() {
            if (this.language.id < 0) {
                return;
            }
            this.loading = true;
            this.$service.languages.deleteLanguage(this.$store.getters.actualProjectId, this.language.id)
            .then(() => {
                this.comebackToLanguageManagement();
                this.$notify(this.$t("success.language_deleted") as string);
            }).catch((error) => {
                if (error.response) {
                    switch (error.response.status) {
                        case 403:
                            this.$notify(this.$t("errors.unauthorized") as string);
                            break;
                        default:
                            this.$notify(this.$t("error.unknown_error") as string);
                    }
                }
                this.$eventBus.$emit(EventEnum.ERROR_ACTION);
            });
        }
    }
})
</script>