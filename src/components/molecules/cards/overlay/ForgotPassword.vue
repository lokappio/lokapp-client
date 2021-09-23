<template>
    <v-card color="white" class="pa-4 pa-md-7 card-style-project">
        <v-container class="pa-0">
            <!-- Title -->
            <v-row :style="{ 'height':'50px' }">
                <v-col cols="11" class="pl-0">
                    <h2 class="title-h2">
                    {{ this.$t("forgot_password.title") }}
                    </h2>
                </v-col>
                <v-col cols="1" class="pr-0">
                    <v-icon @click="closeOverlay" color="black" class="float-right">
                        mdi-close
                    </v-icon>
                </v-col>
            </v-row>

            <keyboard-events :enter="resetPassword" :escape="closeOverlay"/>
            <v-form ref="formSendEmail" onSubmit="return false;">
                <!-- Email -->
                <v-row class="mt-3 pb-0 mb-0">
                    <v-col cols="12" class="py-0 px-2">
                        <span class="title-h3">{{ $t('forgot_password.email_title') }}</span>
                    </v-col>
                </v-row>
                <v-row class="mt-0 mb-2">
                    <v-col cols="12" class="py-0 px-2">
                        <v-text-field :rules="emailRules" class="custom-text-field" background-color="#F2F3F7" v-model="sendEmail" :label="$t('forgot_password.email_label')" type="email" solo flat required></v-text-field>
                    </v-col>
                </v-row>

                <action-button :loading="loading" :text="$t('forgot_password.confirm_button')" :handler="resetPassword" block/>
            </v-form>
        </v-container>
    </v-card>
</template>

<script lang="ts">
import CardEnum from '@/data/models/Card.enum'
import { userEmailRules } from '@/data/rules/UserRules';
import Vue from 'vue'
import ActionButton from '@/components/molecules/buttons/ActionButton.vue'
import KeyboardEvents from '../../KeyboardEvents.vue';

export default Vue.extend({
    name: "forgot-password",
    components: {
        ActionButton,
        KeyboardEvents
    },
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
            emailRules: userEmailRules(this.$t("rules.required") as string, this.$t("rules.mail_valid") as string),
            loading: false
        }
    },
    methods: {
        closeOverlay() {
            this.$store.commit("SET_OPEN_CARD", CardEnum.NONE);
        },
        resetPassword() {
            if ((this.$refs.formSendEmail as any).validate() === true) {
                this.loading = true;
                this.$service.auth.resetPassword(this.sendEmail)
                .then(() => {
                    this.$notify(this.$t("success.password_reset") as string);
                }).catch((err) => {
                    if (err === "unknown_email") {
                        this.$notify(this.$t("errors.reset_failed") as string);
                    } else {
                        this.$notify(this.$t("errors.unknown_error") as string);
                    }
                }).finally(() => {
                    this.loading = false;
                    this.closeOverlay();
                });
            }
        }
    }
})
</script>

<style lang="scss" scoped>

</style>