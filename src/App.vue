<template>
  <v-app>
    <v-main>
      <!-- <Header /> -->
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import {FirebaseHelper} from "@/data/helpers/firebase";

export default Vue.extend({
  name: "App",
  metaInfo: {
    title: '',
    titleTemplate: 'Lokapp'
  },
  mounted() {
    FirebaseHelper.onAuthStateChanged();
  },
});
</script>