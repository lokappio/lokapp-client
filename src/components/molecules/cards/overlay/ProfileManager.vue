<template>
  <v-card color="white" width="100%" class="pa-4 pa-md-7 custom-cards">
    <v-container>
      <!-- Title -->
      <v-row :style="{ 'height':'50px' }">
        <v-col cols="11" class="px-0">
          <h2 class="title-h2">{{ $t("profile_manager.title") }}</h2>
        </v-col>

        <v-col cols="1" class="mr-0 pr-0">
          <v-icon @click="closeOverlay" color="black" class="float-right">mdi-close</v-icon>
        </v-col>
      </v-row>

      <v-form ref="formUpdateProfile">
        <!-- Username -->
        <v-row class="mt-4 pb-0 mb-2">
          <v-col cols="12" class="pb-0 px-0">
            <span class="title-h3">{{ this.$t("profile_manager.username") }} <span class="text-3">{{ this.$t("common.optional") }}</span></span>
          </v-col>
        </v-row>
        <v-row class="mt-0 mb-2">
          <v-col cols="12" class="pb-0 pt-0 px-0">
            <v-text-field class="custom-text-field" hide-details="auto" background-color="inputBackground" v-model="username" solo flat></v-text-field>
          </v-col>
        </v-row>

        <!-- Email -->
        <v-row class="mt-2 pb-0 mb-2">
          <v-col cols="12" class="pb-0 px-0">
            <span class="title-h3">{{ $t("profile_manager.email") }}</span>
          </v-col>
        </v-row>

        <v-row class="mt-0 mb-2">
          <v-col cols="12" class="pb-0 pt-0 px-0">
            <v-text-field disabled class="custom-text-field" hide-details background-color="#7f8182" v-model="user.email" solo flat></v-text-field>
          </v-col>
        </v-row>

        <!-- Buttons -->
        <v-row class="mt-2 pb-0">
          <v-col cols="12" class="pb-0 px-0">
            <action-button block :loading="loading" :handler="validateProfile" :text="$t('profile_manager.validate_profile_button').toString()"/>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" class="text-center pb-0 px-0">
            <v-btn @click="resetPassword" small text color="primary">{{ $t("profile_manager.reset_password") }}</v-btn>
          </v-col>

          <v-col cols="12" class="text-center pb-0 px-0">
            <v-btn @click="logMeOut" small text color="error">{{ $t("profile_manager.disconnect_button") }}</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import ProjectUser from "@/data/models/api/ProjectUser.js";

export default Vue.extend({
  name: "profile-manager",
  props: {dialogOpened: Boolean},
  data() {
    return {
      user: null as ProjectUser,
      username: "",
      loading: false
    };
  },
  watch: {
    dialogOpened: {
      immediate: true,
      handler: function (isOpen) {
        if (isOpen) {
          this.user = this.$store.getters.appUser;
          this.username = this.user?.username ?? "";
        }
      }
    }
  },
  methods: {
    validateProfile() {
      if (this.username !== this.user.username) {
        if (this.username.length === 0) this.username = null;

        this.loading = true;
        this.$service.user.updateProfile(this.username)
            .then((user) => {
              this.$store.commit('UPDATE_APP_USER', user);
              this.closeOverlay();
            })
            .catch(() => this.$notify(this.$t("errors.update_user").toString(), {color: "red"}))
            .finally(() => this.loading = false);
      }
    },
    resetPassword() {
      this.$service.auth.resetPassword(this.user.email)
          .then(() => {
            this.$notify(this.$t("success.password_reset").toString(),{color: "primary"});
            this.$service.auth.logOut().then(() => this.$router.push("/login"))
          })
          .catch(() => this.$notify(this.$t("errors.reset_password").toString(), {color: "red"}));
    },
    logMeOut() {
      this.$service.auth.logOut()
          .then(() => this.$router.push("/login"));
    },
    closeOverlay() {
      this.$emit("close");
    }
  }
});
</script>