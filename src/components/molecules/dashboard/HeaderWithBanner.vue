<template>
  <v-container fluid>
    <v-dialog v-model="dialogOpened" max-width="500px">
      <ProfileManager :dialog-opened="dialogOpened" @close="() => this.dialogOpened = false"/>
    </v-dialog>

      <v-row no-gutters>
        <v-col cols="12" md="6">
          <v-row >
            <v-col cols="auto">
              <v-btn @click="() => this.dialogOpened = true" color="primary" fab depressed>
                <v-icon large>mdi-account</v-icon>
              </v-btn>
            </v-col>

            <v-col cols="auto">
              <p><span class="title-h1">{{ $t("header.greetings") + " " }}</span><span class="title-h1 primary--text">{{ appUser.name }}</span></p>
              <p v-if="!projectDetail" class="text-1">{{ $t("header.greetings_description") }}</p>
            </v-col>
          </v-row>
        </v-col>


        <v-col v-if="!projectDetail" cols="12" md="5">
          <v-text-field solo v-model="searchValue" :label="$t('common.search_label')"></v-text-field>
        </v-col>
      </v-row>

      <!-- TODO: FIX SVG ILLUSTRATION
      <v-row v-if="!projectDetail">
        <v-col cols="12">
          <v-row class="banner-container">
            <v-col cols="6" class="fill-height">
              <span class="title-h2 white--text">{{ $t("header.banner_title") }}</span>
            </v-col>

            <v-col cols="6" class="pa-0 fill-height">
              <v-img class="background-banner" src="Banner/BannerBackground.svg" contain/>
              <v-img class="men-style" src="Banner/Man.svg" contain/>
              <v-img class="women-style" src="Banner/Women.svg" contain/>
            </v-col>
          </v-row>
        </v-col>
      </v-row> -->
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ProfileManager from "@/components/molecules/cards/overlay/ProfileManager.vue";
import ProjectUser from "@/data/models/api/ProjectUser";

export default Vue.extend({
  name: "header-banner",
  components: {ProfileManager},
  props: {projectDetail: {type: Boolean, default: false}},
  data() {
    return {
      searchValue: "",
      dialogOpened: false
    };
  },
  computed: {
    appUser(): ProjectUser {
      return this.$store.getters.appUser;
    }
  },
  watch: {
    searchValue(value) {
      this.$store.commit("SET_SEARCH_PROJECT", value);
    }
  },
  destroyed() {
    this.$store.commit("SET_SEARCH_PROJECT", "");
  }
});
</script>

<style lang="scss" scoped>
.icon-color {
  background-color: var(--v-primary-base);
  color: white;
}

.rounded-button-style {
  height: 50px !important;
  width: 50px !important;
  border-radius: 50%;
  float: left;
}

.banner-container {
  border-radius: 20px;
  height: 150px;
  background-color: var(--v-primary-base);
}
</style>