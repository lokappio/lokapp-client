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
  data: () => ({
  }),
  mounted() {
    this.observeCurrentUser()
  },
  methods: {
    observeCurrentUser() {      
      firebase.auth().onAuthStateChanged(user =>  {
        this.$store.commit("SET_USER", user);
        this.$store.commit("SET_APPLICATION_READY");
      });      
    }
  }
});
</script>