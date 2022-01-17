<template>
        <v-container class="full-contain pa-0 ma-0 my-full-container">
            <v-dialog v-model="dialogOpened" max-width="500">
                <download-project-card :dialog-opened="dialogOpened" @close="() => this.dialogOpened = false"></download-project-card>
            </v-dialog>

            <v-row class="full-contain ma-0">
                <!-- LeftPart -->
                <v-col cols="6">
                    <v-row>
                      <v-col>
                        <v-row align="center">
                          <span class="title-h2 detail-project-name-title">{{ currentProject.name }}</span>
                          <project-settings-button :project-id="currentProject.id"/>
                        </v-row>
                      </v-col>

                      <v-col cols="12">
                        <p class="text-2 detail-project-description">{{ currentProject.description }}</p>
                      </v-col>
                    </v-row>
                </v-col>

                <v-col cols="1" class="pr-0 pl-auto">
                    <v-btn @click="() => this.dialogOpened = true" color="maincolor" class="download-button">
                        <v-icon color="white">mdi-download</v-icon>
                    </v-btn>
                </v-col>

                <!-- RightPart -->
                <v-col cols="5">
                    <v-text-field clearable solo v-model="searchValue" :label="$t('common.search_label')"></v-text-field>
                </v-col>
            </v-row>
        </v-container>
</template>

<script lang="ts">
import ProjectSettingsButton from "@/components/molecules/buttons/ProjectSettingsButton.vue";
import Vue from "vue";
import Project from "@/data/models/api/Project";
import DownloadProjectCard from "@/components/molecules/cards/overlay/DownloadProject.vue";

export default Vue.extend({
    name: 'detail-header',
    components: {DownloadProjectCard, ProjectSettingsButton},
    data() {
      return {
          dialogOpened: false,
          searchValue: "",
      }
    },
    destroyed() {
        this.$store.commit("SET_SEARCH_TRANSLATION", "");
    },
    watch: {
        searchValue(value) {
            this.$store.commit("SET_SEARCH_TRANSLATION", value ?? "");
        }
    },
    computed: {
      currentProject(): Project {
          return this.$store.getters.currentProject;
      }
    }
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