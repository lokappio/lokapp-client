<template>
  <v-container>
    <v-row>
      <v-col class="pt-md-16">
        <h1 class="text-h4 text-md-h2">{{ $t("home.title") }}</h1>
        <h3 class="subtitle-2 text-md-subtitle-1 mt-3">
          A Vue 2 + Vuetify template
        </h3>
        <v-divider class="my-5"/>

        <div class="d-flex flex-column align-start">
          <v-btn href="https://vuetifyjs.com/" target="_blank" dark
            >Documentation Vuetify
          </v-btn>
          <v-btn to="/404" color="primary" class="mt-3">
            Link to 404 page
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class Home extends Vue {}
</script>
