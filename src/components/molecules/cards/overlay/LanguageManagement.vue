<template>
    <div>
        <v-dialog v-model="dialogOpenedDelete" max-width="500px">
            <LanguageDelete :dialog-opened="dialogOpenedDelete" :project-id="projectId" :language="languageToDelete" @closeDelete="() => this.dialogOpenedDelete = false"/>
        </v-dialog>

        <v-card color="white" width="100%" class="pa-4 pa-md-7 card-style-project">
            <v-container>
                <!-- Title -->
                <v-row class="mb-2 row-title">
                    <v-col cols="11">
                        <h2 class="title-h2">{{ $t("language_manage.title") }}</h2>
                    </v-col>

                    <v-col cols="1">
                        <v-icon @click="closeOverlay" color="black" class="float-right">mdi-close</v-icon>
                    </v-col>
                </v-row>

                <v-container class="list-languages-style pa-0">
                    <v-row class="mx-0 my-2 pr-1" v-for="language in languages" :key="language.id">
                        <v-col cols="12" class="pb-0 pt-0 px-0">
                            <span class="title-h3">{{ language.name }}</span>
                            <v-icon @click="deleteLanguage(language)" class="float-right" color="maincolor">mdi-delete</v-icon>
                        </v-col>
                    </v-row>
                </v-container>
            </v-container>
        </v-card>
    </div>
</template>

<script lang="ts">
import Language from "@/data/models/api/Language";
import Vue from "vue";
import LanguageDelete from "@/components/molecules/cards/overlay/LanguageDelete.vue";

export default Vue.extend({
    name: "language-management",
    components: {LanguageDelete},
    props: {projectId: Number, dialogOpened: Boolean},
    data() {
        return {
            dialogOpenedDelete: false,
            languageToDelete: null as Language
        };
    },
    computed: {
      languages(): Language[] {
        return this.$store.getters.currentProject.languages;
      }
    },
    methods: {
        closeOverlay(): void {
            this.$emit("close");
        },
        deleteLanguage(language: Language): void {
            this.dialogOpenedDelete = true;
            this.languageToDelete = language;
        }
    }
});
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