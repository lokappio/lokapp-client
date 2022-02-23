<template>
  <v-container>
    <v-row>
      <v-col class="pt-md-16">
        <v-btn to="/" color="primary">
          <v-icon>mdi-chevron-left</v-icon>
          Back
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class NotFound extends Vue {}
</script>
