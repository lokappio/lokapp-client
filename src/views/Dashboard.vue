<template>
  <v-container fluid class="full-screen-container px-0 py-3">
    <v-row class="fill-height">
      <v-col class="fill-height" cols="auto">
        <left-nav-bar/>
      </v-col>

      <v-col class="fill-height">
        <v-card class="card-style-content background-color-white fill-height my-2">
          <v-row>
            <v-col cols="12">
              <header-banner class="ma-5"/>
            </v-col>

            <v-col cols="12">
              <my-projects/>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {Vue} from "vue-property-decorator";
import MyProjects from "@/components/molecules/dashboard/MyProjects.vue";
import HeaderBanner from "@/components/molecules/dashboard/HeaderWithBanner.vue";
import LeftNavBar from "@/components/molecules/LeftNavBar.vue";

export default Vue.extend({
  components: {
    MyProjects,
    HeaderBanner,
    LeftNavBar
  },
  metaInfo() {
    return {
      title: "Lokapp",
      titleTemplate: null
    };
  }

});
</script>

<style lang="scss" scoped>
.full-screen-container {
  background-color: var(--v-primary-base);
  width: 100vw;
  height: 100vh;
}

.card-style-content {
  border-radius: 15px 0 0 15px !important;
}
</style>