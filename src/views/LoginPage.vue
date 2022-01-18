
<template>
  <v-container fluid class="full-screen-container">
    <v-row class="full-screen-row">
      
      <!-- LeftPart -->
      <v-col align-self="start" class="ma-0 pa-0 full-screen-row" md="6" cols="12">
        <v-container fluid class="full-screen-container">
    
          <!-- Header -->
          <v-row fill-height align="center" class="row-header">
            <v-col cols="9" sm="12">
              <up-bar :pageName="pageName"/>
            </v-col>
          </v-row>

          <!-- Inscription/Login -->
          <v-row class="row-form">
            <v-col offset="0" cols="12" offset-sm="2" sm="8" class="col-form">
              <login-form/>
            </v-col>
          </v-row>
        </v-container>
      </v-col>

      <!-- RightPart -->
      <v-col v-if="$vuetify.breakpoint.mdAndUp" cols="6">
        <illustration/>
      </v-col>      
    </v-row>
    
  </v-container>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import UpBar from "@/components/molecules/login/UpBar.vue";
import LoginForm from "@/components/molecules/login/LoginForm.vue";
import Illustration from "@/components/molecules/login/Illustration.vue";

@Component({
  components: { 
    UpBar,
    LoginForm,
    Illustration,
  },
})
export default class LoginPage extends Vue {
  data() {
    return {
      pageName: "Lokapp"
    }
  }
}
</script>

<style lang="scss" scoped>
  .full-screen-container {
    background-color: white;
    height:100vh
  }
  .full-screen-row {
    background-color: white;
    height: 100vh;
  }
  .row-header {
    background-color: white;
    height: 12vh;
  }
  .row-form {
    background-color: white;
    height: 76vh;
  }
  .row-bottom {
    background-color: white;
    height: 12vh;
  }
  .col-form {
    background-color: white;
    height: 50vh;
  }
  .utilisation-text {
    font-size: 10px;
    line-height: 11px;
    letter-spacing: 0.05em;
    text-align: center;
    color: rgba(0, 0, 0, 0.3);
  }

</style>