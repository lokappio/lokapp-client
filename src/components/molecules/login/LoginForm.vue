

<template>
  <v-card height="100%" mandatory elevation="0">

    <v-overlay color="transparent" absolute :value="$store.getters.openCard === CardEnum.FORGOT_PASSWORD">
      <forgot-password :email="email"/>
    </v-overlay>

    <!-- Connexion ou Inscription -->
      <v-tabs v-model="toggleExclusive" color="white" grow centered >
        <v-tabs-slider color="maincolor"></v-tabs-slider>
        <v-tab :key="0" @change="activeConnexion">
          <div :class="toggleExclusive === 0 ? 'activatedTab' : 'desactivatedTab'">
            {{ connexionText }}
          </div>
        </v-tab>
        <v-tab :key="1" @change="activeInscription">
          <div :class="toggleExclusive === 1 ? 'activatedTab' : 'desactivatedTab'">
            {{ inscriptionText }}
          </div>
        </v-tab>
      </v-tabs>

    <!-- Formulaires -->
      <v-tabs-items v-model="toggleExclusive">

        <!-- Formulaire de connexion -->
        <v-tab-item :key="0" @keyup.enter="validateLogin()">
          <v-form class="pt-md-10 pl-md-2 pr-md-2 pb-md-3" ref="formLogin">
            <v-text-field class="pt-4 pt-md-1" v-model="email" :rules="emailRules" :label=mailLabel required></v-text-field>
            <v-text-field class="pt-2 pt-md-1" v-model="passwordLogin" :rules="passwordLoginRules" type="password" :label=passwordLabel required></v-text-field>
            <v-btn color="black" :loading="loading" :disabled="loading" @click="validateLogin" min-height="50" block><div class="buttonValid">{{ $t("connexion.login") }}</div></v-btn>
          </v-form>
          <div class="mt-2 ml-2 smallLine" @click="forgotPassword">{{ $t("connexion.forgot_password") }}</div>
        </v-tab-item>

        <!-- Formulaire d'inscription -->
        <v-tab-item :key="1" @keyup.enter="validateRegister()">
          <v-form class="pt-md-10 pl-md-2 pr-md-2 pb-md-3" ref="formRegister">
            <v-text-field class="pt-4 pt-md-1" v-model="pseudo" :label=pseudoLabel></v-text-field>
            <v-text-field class="pt-2 pt-md-1" v-model="email" :rules="emailRules" :label=mailLabel required></v-text-field>
            <v-text-field class="pt-2 pt-md-1" v-model="password" :rules="passwordRules" type="password" :label=passwordLabel required></v-text-field>
            <v-text-field class="pt-2 pt-md-1" v-model="passwordCopy" :rules="passwordCopyRules" type="password" :label=passwordConfirmLabel required></v-text-field>
            <v-btn color="black" :loading="loading" :disabled="loading" min-height="50" @click="validateRegister" block><div class="buttonValid">{{ $t("connexion.register") }}</div></v-btn>
          </v-form>
          <div class="mt-2 ml-2 smallLine" @click="forgotPassword">{{ $t("connexion.forgot_password") }}</div>
        </v-tab-item>

      </v-tabs-items>

  </v-card>
</template>

<script>
import {optionalString} from "@/data/formatting/StringFormatting";
import {userEmailRules, userPasswordLoginRules, userPasswordRules} from "@/data/rules/UserRules";
import ForgotPassword from "@/components/molecules/cards/overlay/ForgotPassword.vue";
import CardEnum from "@/data/models/Card.enum";

export default (
  'login-form', {
  components: {
    ForgotPassword
  },
  data: function () {
    return {
      //Tabs
      toggleExclusive: 0,
      connexionText: this.$t("connexion.login"),
      inscriptionText: this.$t("connexion.register"),
      pseudoLabel: optionalString(this.$t("connexion.nickname"), this.$t("common.optional")),
      mailLabel: this.$t("connexion.mail") + "*",
      passwordLabel: this.$t("connexion.password") + "*",
      passwordConfirmLabel: this.$t("connexion.password_confirmation") + "*",

      //Login/Inscription
      email: '',
      emailRules: userEmailRules(this.$t("rules.required"), this.$t("rules.mail_valid")),

      passwordLogin: '',
      passwordLoginRules: userPasswordLoginRules(this.$t("rules.required")),

      password: '',
      passwordRules: userPasswordRules(this.$t("rules.required"), this.$t("rules.password_length"), this.$t("rules.password_strong")),

      passwordCopy: '',
      passwordCopyRules: [
        v => !!v || this.$t("rules.required"),
        v => v === this.password || this.$t("rules.password_identical"),
      ],

      pseudo: null,

      // Checkbox and buttons
      loading: false,
      CardEnum
    }
  },
  methods: {
    activeConnexion() {
        this.passwordLogin = '';
    },
    activeInscription() {
        this.password = '';
        this.passwordCopy = '';
        this.pseudo = '';
    },
    forgotPassword() {
      this.$store.commit("SET_OPEN_CARD", CardEnum.FORGOT_PASSWORD);
    },
    validateLogin() {
      if (this.$refs.formLogin.validate() === true) {
        this.loading = true;
        this.$service.auth.logIn(this.email, this.passwordLogin)
        .then(() => this.$router.push('/dashboard'))
        .catch((error) => {
          this.changeErrorText(error.code);
        }).finally(() => {
          this.loading = false;
        });
      }
    },
    validateRegister() {
      if (this.$refs.formRegister.validate() === true) {
        this.loading = true;
        if (this.pseudo?.length === 0)
          this.pseudo = null;
        this.$service.auth.register(this.email, this.password, this.pseudo)
        .then(() => this.$router.push('/dashboard'))
        .catch((error) => {
          this.changeErrorText(error.code);
        }).finally(() => {
          this.loading = false;
        });
      }
    },
    changeErrorText(errorCode) {
      switch (errorCode) {
        case "auth/user-not-found":
          this.$notify(this.$t("errors.user_not_found"));
          break;
        case "auth/wrong-password":
          this.$notify(this.$t("errors.wrong_password"));
          break;
        case "auth/email-already-in-use":
          this.$notify(this.$t("errors.email_already_in_use"));
          break;
        default:
          this.$notify(this.$t("errors.unknown_error"));
          break;
      }
    }
  }
}) 
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';
  .activatedTab {
    color: #010F5C;
    font-weight: bold;
    font-size: 26px;
    letter-spacing: 0.05em;
  }
  .desactivatedTab {
    color: rgba(0, 0, 0, 0.3);
    font-size: 18px;
    letter-spacing: 0.05em;
  }
  .v-tab {
    text-transform: none !important;
  }
  .buttonValid {
    color: white;
    font-weight: 500;
    font-size: 16px;
    letter-spacing: 0.1em;
    text-transform: none !important;
    line-height: 18px;
  }
  .smallLine {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.3);
  }

@media #{map-get($display-breakpoints, 'md-and-down')} {
  .activatedTab {
    font-size: 22px;
  }
  .desactivatedTab {
    font-size: 16px;
  }
}

@media #{map-get($display-breakpoints, 'sm-and-down')} {
  .activatedTab {
    font-size: 18px;
  }
  .desactivatedTab {
    font-size: 16px;
  }
}
</style> 