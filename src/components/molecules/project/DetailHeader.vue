<template>
  <div>
    <v-dialog v-model="dialogOpened" max-width="500">
      <download-project-card :dialog-opened="dialogOpened" @close="() => this.dialogOpened = false"></download-project-card>
    </v-dialog>

    <v-row no-gutters justify="space-between" class="fill-height">
      <!-- LeftPart -->
      <v-col cols="12" md="6" class="pr-3">
        <v-row no-gutters align="center">
          <span class="title-h2 primary--text">{{ currentProject.name }}</span>
          <project-settings-button class="d-inline ml-1" :project="currentProject" :from-store="true"/>
          <v-select
              v-if="shouldShowSourceLanguage"
              :value="selectedSourceLanguageId"
              class="ml-8 source-language-select"
              hide-details
              :label="$t('project_detail.source_language')"
              :items="sourceLanguages"
              @change="(newId) => this.$emit('source-language-id-changed', newId)"/>
        </v-row>
        <v-row class="mt-2" no-gutters align="center">
          <p class="text-2 description-style">{{ currentProject.description }}</p>
        </v-row>
      </v-col>

      <!-- RightPart -->
      <v-col cols="12" md="6">
        <v-row no-gutters justify="space-between">
          <v-col cols="9">
            <v-text-field clearable solo v-model="searchValue" height="50" :label="$t('common.search_label')"></v-text-field>
          </v-col>

          <v-col cols="auto" class="mr-4">
            <v-btn @click="() => this.dialogOpened = true" depressed height="50" color="primary"><v-icon color="white">mdi-download</v-icon></v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import ProjectSettingsButton from "@/components/molecules/buttons/ProjectSettingsButton.vue";
import Vue from "vue";
import Project from "@/data/models/api/Project";
import DownloadProjectCard from "@/components/molecules/cards/overlay/DownloadProject.vue";
import Language, {LanguageAccess} from "@/data/models/api/Language";

export default Vue.extend({
  name: "detail-header",
  components: {DownloadProjectCard, ProjectSettingsButton},
  props: {
    selectedTargetLanguageId: Number,
    selectedSourceLanguageId: Number
  },
  data() {
    return {
      dialogOpened: false,
      searchValue: ""
    };
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
    },
    sourceLanguages(): { text: string; value: number }[] {
      return this.$store.getters.currentProject.languages.filter((e: Language) => e.access === LanguageAccess.source).map((e: Language) => {
        return {
          text: e.name,
          value: e.id
        };
      });
    },
    shouldShowSourceLanguage(): boolean {
      return this.sourceLanguages.length > 1 && this.selectedTargetLanguageId !== null;
    }
  }
});
</script>

<style lang="scss" scoped>
.description-style {
  text-overflow: ellipsis;
  overflow: hidden;
  max-height: 50%;
}

.source-language-select {
  width: 200px;
  flex: none;
}
</style>