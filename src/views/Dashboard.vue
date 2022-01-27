<template>
  <v-container fluid class="full-screen-container px-0">
    <v-row class="fill-height" no-gutters>
      <v-col class="fill-height" cols="auto">
        <left-nav-bar/>
      </v-col>

      <v-col class="fill-height">
        <v-card class="box card-style-content background-color-white fill-height px-5 pt-5">
            <div class="row header">
              <header-banner />
            </div>

            <div class="row content">
              <my-projects/>
            </div>
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

.box {
  display: flex;
  flex-flow: column;
  height: 100%;
}

.row {
  margin: 0 !important;
}

.row.header {
  flex: 0 1 auto;
}
.row.content {
  flex: 1 1 auto;
}

.card-style-content {
  border-radius: 15px 0 0 15px !important;
}
</style>