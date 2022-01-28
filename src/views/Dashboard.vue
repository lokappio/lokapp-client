<template>
  <v-container fluid class="full-screen-container px-0">
    <v-row class="fill-height" no-gutters>
      <v-col class="fill-height" cols="auto">
        <left-nav-bar/>
      </v-col>

      <v-col>
        <v-card class="box card-style-content background-color-white fill-height px-0 pt-5">
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
@import '~vuetify/src/styles/settings/_variables';

.full-screen-container {
  background-color: var(--v-primary-base);
  width: 100vw;
  height: 100vh;
}

.row {
  margin-bottom: 0 !important;
  margin-left: 12px;
}

@mixin styling($base-height) {
  .row.header {
    height: $base-height;
  }
  .row.content {
    position: absolute;
    top: $base-height;
    bottom: 0;
    width: 100%;
  }
}

@media #{map-get($display-breakpoints, 'xs-only')} {
  @include styling($base-height: 270px);
}

@media #{map-get($display-breakpoints, 'sm-only')} {
  @include styling($base-height: 200px);
}

@media #{map-get($display-breakpoints, 'md-and-up')} {
  @include styling($base-height: 150px);
}

.card-style-content {
  border-radius: 15px 0 0 15px !important;
}
</style>