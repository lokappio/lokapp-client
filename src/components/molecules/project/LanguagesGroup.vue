<template>
    <div>
        <v-dialog v-model="dialogOpened" max-width="800px">
            <LanguageCreation :dialog-opened="dialogOpened" @close="() => this.dialogOpened = false" />
        </v-dialog>

        <v-tabs class="ml-5" background-color="white" show-arrows v-model="actualTab">
            <v-tabs-slider color="red"></v-tabs-slider>
            <v-tab>{{ $t("project_detail.all_languages") }}</v-tab>
            <v-tab v-for="language in languages" :key="language.id">{{ language.name }}</v-tab>
            <v-icon v-if="canWriteLanguage" color="primary" size="24" class="px-4" @click="() => this.dialogOpened = true">mdi-plus-circle</v-icon>
        </v-tabs>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import LanguageCreation from "@/components/molecules/cards/overlay/LanguageCreation.vue";
import Language from "@/data/models/api/Language";

export default Vue.extend({
    name: "languages-group",
    components: {LanguageCreation},
    data() {
        return {
            actualTab: 0,
            dialogOpened: false
        };
    },
    watch: {
        actualTab() {this.setActualLanguage()}
    },
    computed: {
      canWriteLanguage(): boolean {
        return this.$store.getters.appUser.roleAbility ? this.$store.getters.appUser.roleAbility.canWriteLanguage : false;
      },
      languages(): Language[] {
        return this.$store.getters.currentProject.languages;
      }
    },
    methods: {
        setActualLanguage() {
            this.$store.commit("SET_ACTUAL_LANGUAGE", this.actualTab > 0 ? this.languages[this.actualTab - 1].id : null);
        },
    },
});
</script>