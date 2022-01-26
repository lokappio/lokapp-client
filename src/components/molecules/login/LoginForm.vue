<template>
    <v-card height="100%" mandatory elevation="0">
        <v-dialog v-model="dialogOpenedResetPassword" max-width="500px">
            <forgot-password :email="email" @close="() => this.dialogOpenedResetPassword = false"/>
        </v-dialog>

        <v-tabs v-model="toggleExclusive" color="white" grow centered>
            <v-tabs-slider color="maincolor"></v-tabs-slider>
            <v-tab :key="0" @change="activeConnexion">
                <span :class="toggleExclusive === 0 ? 'activatedTab' : 'desactivatedTab'">{{ $t("connexion.login") }}</span>
            </v-tab>

            <v-tab :key="1" @change="activeInscription">
                <span :class="toggleExclusive === 1 ? 'activatedTab' : 'desactivatedTab'">{{ $t("connexion.register") }}</span>
            </v-tab>
        </v-tabs>


        <v-tabs-items v-model="toggleExclusive">
            <!-- LOGIN -->
            <v-tab-item :key="0" @keyup.enter="validateLogin()">
                <v-form class="pt-md-10 pl-md-2 pr-md-2 pb-md-3" ref="formLogin">
                    <v-text-field class="pt-4 pt-md-1" v-model="email" :rules="emailRules" :label=mailLabel required></v-text-field>
                    <v-text-field class="pt-2 pt-md-1" v-model="passwordLogin" :rules="passwordLoginRules" type="password" :label=passwordLabel required></v-text-field>
                    <v-btn color="black" :loading="loading" :disabled="loading" @click="validateLogin" min-height="50" block>
                        <div class="buttonValid">{{ $t("connexion.login") }}</div>
                    </v-btn>
                </v-form>

                <div class="mt-2 ml-2 smallLine" @click="forgotPassword">{{ $t("connexion.forgot_password") }}</div>
            </v-tab-item>

            <!-- SIGN UP -->
            <v-tab-item :key="1" @keyup.enter="validateRegister()">
                <v-form class="pt-md-10 pl-md-2 pr-md-2 pb-md-3" ref="formRegister">
                    <v-text-field class="pt-4 pt-md-1" v-model="pseudo" :label=pseudoLabel></v-text-field>
                    <v-text-field class="pt-2 pt-md-1" v-model="email" :rules="emailRules" :label=mailLabel required></v-text-field>
                    <v-text-field class="pt-2 pt-md-1" v-model="password" :rules="passwordRules" type="password" :label=passwordLabel required></v-text-field>
                    <v-text-field class="pt-2 pt-md-1" v-model="passwordCopy" :rules="passwordCopyRules" type="password" :label=passwordConfirmLabel required></v-text-field>

                    <v-btn color="black" :loading="loading" :disabled="loading" min-height="50" @click="validateRegister" block>
                        <div class="buttonValid">{{ $t("connexion.register") }}</div>
                    </v-btn>
                </v-form>
            </v-tab-item>
        </v-tabs-items>
    </v-card>
</template>

<script>
import {optionalString} from "@/data/helpers/stringFormatting";
import {userEmailRules, userPasswordCopyRules, userPasswordLoginRules, userPasswordRules} from "@/data/rules/UserRules";
import ForgotPassword from "@/components/molecules/cards/overlay/ForgotPassword.vue";
import Vue from "vue";

export default Vue.extend({
    name: "login-form",
    components: {ForgotPassword},
    data() {
        return {
            //Tabs
            toggleExclusive: 0,
            pseudoLabel: optionalString(this.$t("connexion.nickname").toString(), this.$t("common.optional").toString()),
            mailLabel: this.$t("connexion.mail") + "*",
            passwordLabel: this.$t("connexion.password") + "*",
            passwordConfirmLabel: this.$t("connexion.password_confirmation") + "*",

            //Login/Inscription
            email: "",
            emailRules: userEmailRules(this.$t("rules.mail_valid").toString()),

            passwordLogin: "",
            passwordLoginRules: userPasswordLoginRules(),

            password: "",
            passwordRules: userPasswordRules(this.$t("rules.password_length").toString(), this.$t("rules.password_strong").toString()),

            passwordCopy: "",
            passwordCopyRules: userPasswordCopyRules(this.password, this.$t("rules.password_identical").toString()),

            pseudo: null,

            dialogOpenedResetPassword: false,
            loading: false,
        };
    },
    methods: {
        activeConnexion() {
            this.passwordLogin = "";
        },
        activeInscription() {
            this.password = "";
            this.passwordCopy = "";
            this.pseudo = "";
        },
        forgotPassword() {
            this.dialogOpenedResetPassword = true;
        },
        validateLogin() {
            if (this.$refs.formLogin.validate() === true) {
                this.loading = true;
                this.$service.auth.logIn(this.email, this.passwordLogin)
                    .then(() => this.$router.push("/dashboard"))
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
                if (this.pseudo?.length === 0) {
                    this.pseudo = null;
                }
                this.$service.auth.register(this.email, this.password, this.pseudo)
                    .then(() => this.$router.push("/dashboard"))
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
                    this.$notify(this.$t("errors.user_not_found").toString());
                    break;
                case "auth/wrong-password":
                    this.$notify(this.$t("errors.wrong_password").toString());
                    break;
                case "auth/email-already-in-use":
                    this.$notify(this.$t("errors.email_already_in_use").toString());
                    break;
                default:
                    this.$notify(this.$t("errors.unknown_error").toString());
                    break;
            }
        }
    }
});
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