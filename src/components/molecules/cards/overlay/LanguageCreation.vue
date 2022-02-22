<template>
  <v-card color="white" class="pa-4 pa-md-7 custom-cards">
    <!-- Title -->
    <v-row :style="{ 'height':'50px' }">
      <v-col cols="11" class="pl-0">
        <p class="title-h2">{{ $t("language_creation.title") }}</p>
      </v-col>

      <v-col cols="1" class="pr-0">
        <v-icon @click="closeLanguageCreation" color="black" class="float-right">mdi-close</v-icon>
      </v-col>
    </v-row>

    <v-form ref="formCreateLanguage" @submit.prevent="() => false">
      <!-- Language name -->
      <v-row class="mt-4 pb-0 mb-0">
        <v-col cols="12" class="pb-0 px-0">
          <span class="title-h3">{{ $t("language_creation.language_name_title") }}</span>
        </v-col>
      </v-row>
      <v-row class="mt-0">
        <v-col cols="12" class="pb-0 pt-0 px-0">
          <v-text-field
              autofocus
              :rules="languageNameRules"
              class="custom-text-field"
              background-color="inputBackground"
              v-model="languageName"
              :label="$t('language_creation.language_name_label')"
              solo
              flat
              required
              @keydown.enter="createNewLanguage"></v-text-field>
        </v-col>
      </v-row>

      <!-- ValidateButton -->
      <v-row class="mt-0 pb-0">
        <v-col cols="12" class="pb-0 px-0">
          <action-button block :loading="loading" :handler="createNewLanguage" :text="$t('language_creation.confirm_button')"/>
        </v-col>
      </v-row>
    </v-form>

  </v-card>
</template>

<script>
import {languageNameRules} from "@/data/rules/LanguageRules";
import Vue from "vue";

export default Vue.extend({
  name: "language-creation",
  props: {dialogOpened: Boolean},
  data: function () {
    return {
      loading: false,
      languageName: "",
      languageNameRules: languageNameRules(),
      isBlockButton: true
    };
  },
  watch: {
    dialogOpened(isOpened) {
      if (isOpened) {
        //ON RE-OPENED, RESET DATA
        this.languageName = "";
        this.$refs.formCreateLanguage.resetValidation();
      }
    }
  },
  methods: {
    createNewLanguage() {
      if (this.$refs.formCreateLanguage.validate() === true) {
        this.loading = true;

        this.$service.languages.createLanguage(this.languageName.toLowerCase())
            .then((result) => {
              this.loading = false;
              this.$store.commit("UPDATE_PROJECT_LANGUAGES", result);
              this.$notify(this.$t("success.language_created").toString());
              this.closeLanguageCreation();
            })
            .catch((error) => this.$notify(this.$t(error).toString()))
            .finally(() => this.loading = false);
      }
    },
    closeLanguageCreation() {
      this.$emit("close", false);
    }
  }
});

</script>