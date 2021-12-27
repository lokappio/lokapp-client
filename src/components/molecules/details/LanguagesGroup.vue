<template>

    <v-tabs class="details-tabs-style" background-color="white" v-model="actualTab">
        <v-tabs-slider color="#FF1F38"></v-tabs-slider>
        <v-tab>{{ $t("project_detail.all_languages") }}</v-tab>
        <v-tab v-for="language in languages" :key="language.id">{{ language.name }}</v-tab>
        <v-icon v-if="canWriteLanguage()" color="maincolor" class="px-4 icon-style" @click="openLanguageCreation">mdi-plus-circle</v-icon>
    </v-tabs>

</template>

<script lang="ts">
import EventEnum from "@/data/enum/event-bus.enum";
import CardEnum from "@/data/models/Card.enum";
import Vue from "vue";

export default Vue.extend({
    name: "languages-group",
    data() {
        return {
            languages: [],
            actualTab: 0
        };
    },
    mounted() {
        this.refreshLanguagesList()
    },
    watch: {
        actualTab: function () {
            this.setActualLanguage();
        }
    },
    methods: {
        canWriteLanguage() {
            return this.$store.getters.actualRole ? this.$store.getters.actualRole.canWriteLanguage : false;
        },
        refreshLanguagesList() {
            this.actualTab = 0;
            this.languages = [];

            this.$service.languages.getLanguages()
                .then(languages => this.languages = languages)
                .catch(() => this.$eventBus.$emit(EventEnum.ERROR_GET_SOMETHING));
        },
        setActualLanguage() {
            this.$store.commit("SET_ACTUAL_LANGUAGE", this.actualTab > 0 ? this.languages[this.actualTab - 1].id : null);
        },
        openLanguageCreation() {
            this.$store.commit("SET_OPEN_CARD", CardEnum.CREATE_LANGUAGE);
        },
    },

});
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';

.details-tabs-style .v-tabs-slider-wrapper {
    height: 0px !important;
    max-width: 60px;
    border-bottom: 4px solid #FF1F38;
}

.details-tabs-style .v-tab {
    padding-left: 4px;
    padding-right: 20px;
}

.details-tabs-style .v-tab--active {
    font-family: Nobile;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 18px;
    letter-spacing: 0.05em;
    color: #000000;
}

.details-tabs-style :not(.v-tab--active) {
    font-family: Nobile;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 18px;
    letter-spacing: 0.05em;
    color: rgba(0, 0, 0, 0.3);
}

.details-tabs-style .v-tab:before {
    background-color: transparent;
}

.icon-style {
    font-size: 24px !important;
}
</style>