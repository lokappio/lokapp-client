<template>
  <v-container fluid class="mr-5">
    <v-dialog v-model="dialogOpened" max-width="500px">
      <ProfileManager :dialog-opened="dialogOpened" @close="() => this.dialogOpened = false"/>
    </v-dialog>

      <v-row no-gutters align="center" justify="space-between">
        <v-col cols="12" :md="!projectDetail ? '6' : '12'">
          <v-row no-gutters align="baseline">
            <v-col cols="auto">
              <v-btn @click="() => this.dialogOpened = true" color="primary" fab depressed>
                <v-icon large>mdi-account</v-icon>
              </v-btn>
            </v-col>

            <v-col cols="10" class="ml-3">
              <p><span class="title-h1">{{ $t("header.greetings") + " " }}</span><span class="title-h1 primary--text">{{ appUser.name }}</span></p>
            </v-col>
          </v-row>
        </v-col>

        <v-col v-if="!projectDetail" cols="12" md="5">
          <v-text-field solo v-model="searchValue" hide-details :label="$t('common.search_label')"></v-text-field>
        </v-col>

        <invitations-button @refreshProjects="() => $emit('refreshProjects')"/>
      </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ProfileManager from "@/components/molecules/cards/overlay/ProfileManager.vue";
import ProjectUser from "@/data/models/api/ProjectUser";
import InvitationsButton from "@/components/molecules/buttons/InvitationsButton.vue";

export default Vue.extend({
  name: "header-banner",
  components: {InvitationsButton, ProfileManager},
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