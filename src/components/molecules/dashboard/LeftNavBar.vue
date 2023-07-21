<template>
  <div class="left-nav-bar mx-6">
    <v-img
        class="logo-style set-cursor-pointer"
        src="/assets/img/logo-white.svg"
        :min-height=20
        :min-width=20
        :max-height=50
        :max-width="50"
        @click="redirectToDashboard"
        contain
    />

    <v-btn fab small elevation="0" class="preferences-button" @click="() => this.preferencesModalOpened = true">
      <v-icon color="white">mdi-cog</v-icon>
    </v-btn>

    <v-dialog v-model="preferencesModalOpened" max-width="500px">
      <ProfileManager :dialog-opened="preferencesModalOpened" @close="() => this.preferencesModalOpened = false"/>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ProfileManager from "@/components/molecules/cards/overlay/PreferencesManagement.vue";

export default Vue.extend({
  name: "left-nav-bar",
  components: {ProfileManager},
  data() {
    return {
      preferencesModalOpened: false
    };
  },
  methods: {
    redirectToDashboard() {
      this.$router.push("/dashboard");
    }
  }
});
</script>

<style lang="scss" scoped>
.left-nav-bar {
  height: 100%;
  position: relative;
}

.preferences-button {
  background-color: transparent !important;
  position: absolute;
  bottom: 0;
}
</style>