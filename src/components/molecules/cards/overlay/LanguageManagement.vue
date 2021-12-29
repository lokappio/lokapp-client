<template>
    <v-card color="white" width="100%" class="pa-4 pa-md-7 card-style-project">
        <v-container>
        <!-- Title -->
            <v-row class="mb-2 row-title">
                <v-col cols="11">
                    <h2 class="title-h2">{{ $t('language_manage.title') }}</h2>
                </v-col>

                <v-col cols="1">
                    <v-icon @click="closeOverlay" color="black" class="float-right">mdi-close</v-icon>
                </v-col>
            </v-row>
            <v-container class="list-languages-style pa-0">
                <v-row class="mx-0 my-2 pr-1" v-for="language in languages" :key="language.id">
                    <v-col cols="12" class="pb-0 pt-0 px-0">
                        <span class="title-h3">{{ language.name }}</span>
                        <v-icon @click="deleteLanguage(language)" class="float-right" color="maincolor">
                            mdi-delete
                        </v-icon>
                    </v-col>
                </v-row>
            </v-container>
        </v-container>
    </v-card>
</template>

<script lang="ts">
import EventEnum from "@/data/enum/event-bus.enum";
import CardEnum from '@/data/models/Card.enum';
import Language from '@/data/models/api/Language';
import Vue from 'vue'

export default Vue.extend({
    name: "language-management",
    props: {projectId: Number, dialogOpened: Boolean},
    data() {
        return {
            languages: []
        }
    },
    watch: {
        dialogOpened(isOpened) {
            if (isOpened) {
                //ON RE-OPENED, RESET DATA
                this.languages = [];

                this.getLanguages();
            }
        }
    },
    methods: {
        getLanguages() {
            this.$service.languages.getLanguages(this.projectId)
                .then((languages) => {
                    languages.forEach(language => {
                        this.languages.push(language);
                    });
                }).catch(() => {
                this.closeOverlay();
                this.$eventBus.$emit(EventEnum.ERROR_GET_SOMETHING);
            });
        },
        closeOverlay() {
            this.$emit("close");
            this.$eventBus.$emit(EventEnum.REFRESH_LANGUAGES_LIST);
            this.$eventBus.$emit(EventEnum.REFRESH_KEYS_LIST);
        },
        deleteLanguage(language: Language) {
            this.$store.commit("SET_OPEN_CARD", CardEnum.DELETE_LANGUAGE);
            this.$store.commit("SET_ACTUAL_LANGUAGE", language);
        }
    }
})
</script>

<style lang="scss" scoped>
    .row-title {
        height: 50px;
    }
    .list-languages-style {
        max-height: 300px;
        overflow-y: auto;  
    }
</style>