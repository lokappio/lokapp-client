<template>
  <v-container fluid class="mr-5">
    <v-dialog v-model="dialogOpened" max-width="500px">
      <ProfileManager :dialog-opened="dialogOpened" @close="() => this.dialogOpened = false"/>
    </v-dialog>

      <v-row no-gutters align="center" justify="space-between">
        <v-col cols="12" :md="!projectDetail ? '6' : '12'">
          <v-row no-gutters align="center">
            <v-col cols="auto">
              <v-btn @click="() => this.dialogOpened = true" color="primary" fab depressed>
                <v-icon large>mdi-account</v-icon>
              </v-btn>
            </v-col>

            <v-col cols="10" class="ml-3">
              <span class="title-h1">{{ $t("header.greetings") + " " }}<span class="title-h1 primary--text">{{ appUserName }}</span></span>
            </v-col>
          </v-row>
        </v-col>

        <v-col v-if="!projectDetail" cols="12" md="5">
          <v-text-field solo v-model="searchValue" class="custom-shadow" hide-details :label="$t('common.search_label')"></v-text-field>
        </v-col>

        <invitations-button v-if="!projectDetail" @refreshProjects="() => $emit('refreshProjects')"/>
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
    appUserName(): ProjectUser {
      return this.$store.getters.appUser?.name ?? "";
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
.v-text-field.custom-shadow {
  box-shadow: 0 -2px 10px rgba(200, 200, 200, 0.2)
}
</style>