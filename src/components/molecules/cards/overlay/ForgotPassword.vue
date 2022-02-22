<template>
    <v-card color="white" class="pa-4 custom-cards">
            <v-card-title class="pa-0">
              <v-row no-gutters justify="space-between">
                <h2 class="title-h2">{{ this.$t("forgot_password.title") }}</h2>
                <v-icon @click="closeOverlay" color="black" class="float-right">mdi-close</v-icon>
              </v-row>
            </v-card-title>

            <v-form class="mt-3" ref="formSendEmail" onSubmit="return false;">
                <span class="title-h3">{{ $t('forgot_password.email_title') }}</span>
                <v-text-field
                    :rules="emailRules"
                    class="custom-text-field"
                    background-color="inputBackground"
                    v-model="sendEmail"
                    :label="$t('forgot_password.email_label')"
                    type="email"
                    solo
                    flat
                    required>
                </v-text-field>

                <action-button :loading="loading" :text="$t('forgot_password.confirm_button').toString()" :handler="resetPassword" block/>
            </v-form>
    </v-card>
</template>

<script lang="ts">
import { userEmailRules } from '@/data/rules/UserRules';
import Vue from 'vue'

export default Vue.extend({
    name: "forgot-password",
    created() {
        this.sendEmail = this.email;
    },
    props: {
        email: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            sendEmail: "",
            emailRules: userEmailRules(),
            loading: false
        }
    },
    methods: {
        closeOverlay() {
            this.$emit("close");
        },
        resetPassword() {
            if ((this.$refs.formSendEmail as any).validate() === true) {
                this.loading = true;
                this.$service.auth.resetPassword(this.sendEmail)
                .then(() => this.$notify(this.$t("success.password_reset").toString(), {color: "primary"}))
                .catch((err) => {
                    if (err === "unknown_email") {
                        this.$notify(this.$t("errors.reset_failed").toString(), {color: "red"});
                    } else {
                        this.$notify(this.$t("errors.unknown_error").toString(), {color: "red"});
                    }
                })
                .finally(() => {
                    this.loading = false;
                    this.closeOverlay();
                });
            }
        }
    }
})
</script>