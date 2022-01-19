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
import firebase from "firebase/app";

export default Vue.extend({
  name: "App",
  metaInfo: {
    title: '',
    titleTemplate: 'Lokapp'
  },
  mounted() {
    this.observeCurrentUser()
  },
  methods: {
    observeCurrentUser() {      
      firebase.auth().onAuthStateChanged(async user =>  {
        this.$store.commit("SET_USER", user);
        this.$store.commit('SET_APP_USER', user != null ? await this.$service.user.getMe() : null);
        this.$store.commit("SET_APPLICATION_READY");
      });      
    }
  }
});
</script>