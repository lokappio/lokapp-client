

<template>
  <v-container fill-height fluid>
    <v-row align="center"
      justify="start">

      <!-- Logo -->
      <v-col cols="2" class="ml-0 pb-5 logo">
        <v-img 
          :src="logoPath"
          :min-height=20
          :min-width=20
          :max-height=50
          contain>
        </v-img>
      </v-col>

      <!-- Nom de la page -->
      <v-col cols="auto">
        <div class="page-name">
          {{ pageName }}
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default (
  'up-bar', {
  data: function () {
    return {
      logoPath: "logo.svg",
    }
  },
  props: ['pageName']
})
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/settings/_variables';

  .logo {
    background-color: transparent;
  }
  .page-name {
    font-size:22px;
    font-weight:bold;
    letter-spacing:0.05em;
  }
@media #{map-get($display-breakpoints, 'xs-only')} {
  .page-name {
    font-size: 18px;
  }
}
@media #{map-get($display-breakpoints, 'xl-only')} {
  .page-name {
    font-size: 28px !important;
  }
}
</style>