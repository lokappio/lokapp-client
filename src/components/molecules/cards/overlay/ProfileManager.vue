<template>
    <v-card color="white" width="100%" class="pa-4 pa-md-7 card-style-project">
        <v-container>
            <!-- Title -->
            <v-row :style="{ 'height':'50px' }">
                <v-col cols="11" class="px-0">
                    <h2 class="title-h2">{{ $t("profile_manager.title") }}</h2>
                </v-col>

                <v-col cols="1" class="mr-0 pr-0">
                    <v-icon @click="closeOverlay" color="black" class="float-right">mdi-close</v-icon>
                </v-col>
            </v-row>

            <v-form ref="formUpdateProfile">
                <!-- Username -->
                <v-row class="mt-4 pb-0 mb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <span class="title-h3">{{ this.$t("profile_manager.username") }} <span v-if="modificationActivated" class="text-3">{{ this.$t("common.optional") }}</span></span>
                    </v-col>
                </v-row>
                <v-row class="mt-0">
                    <v-col cols="12" class="pb-0 pt-0 px-0">
                        <v-text-field :disabled="!modificationActivated" :rules="usernameRules" class="custom-text-field" background-color="#F2F3F7" v-model="username" solo flat></v-text-field>
                    </v-col>
                </v-row>

                <!-- Email -->
                <v-row class="mt-4 pb-0 mb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <span class="title-h3">{{ $t("profile_manager.email") }}</span>
                    </v-col>
                </v-row>

                <v-row class="mt-0">
                    <v-col cols="12" class="pb-0 pt-0 px-0">
                        <v-text-field disabled class="custom-text-field" background-color="#7f8182" v-model="email" solo flat></v-text-field>
                    </v-col>
                </v-row>

                <!-- Buttons -->
                <v-row v-if="!modificationActivated" class="mt-2 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :loading="loading" :handler="changeProfile" :text="$t('profile_manager.change_profile_button')"/>
                    </v-col>
                </v-row>

                <v-row v-if="modificationActivated" class="mt-2 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :loading="loading" :handler="validateProfile" :text="$t('profile_manager.validate_profile_button')"/>
                    </v-col>
                </v-row>

                <v-row v-if="modificationActivated" class="mt-2 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <deprecated-button block :handler="resetPassword" :text="$t('profile_manager.reset_password')"/>
                    </v-col>
                </v-row>

                <v-row v-if="!modificationActivated" class="mt-2 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <deprecated-button block :handler="logMeOut" :text="$t('profile_manager.disconnect_button')"/>
                    </v-col>
                </v-row>
            </v-form>
        </v-container>
    </v-card>
</template>

<script>
import ActionButton from "@/components/molecules/buttons/ActionButton";
import DeprecatedButton from "@/components/molecules/buttons/DeprecatedButton";
import EventEnum from "@/data/enum/event-bus.enum";
import CardEnum from "@/data/models/Card.enum";
import {optionalUsernameRules} from "@/data/rules/UserRules";
import Vue from "vue";

export default Vue.extend({
    name: "profile-manager",
    components: {ActionButton, DeprecatedButton},
    props: {dialogOpened: Boolean},
    data: function () {
        return {
            oldUsername: "",
            username: "",
            email: "",
            usernameRules: optionalUsernameRules(this.$t("rules.username_length")),
            modificationActivated: false,
            loading: false,
            CardEnum
        };
    },
    watch: {
        dialogOpened: {
            immediate: true,
            handler: function(isOpen) {
                if(isOpen) {
                    this.getMe();
                }
            }
        }
    },
    methods: {
        getMe() {
            this.$service.user.getMe()
                .then(user => {
                    if (user.username === null) {
                        this.username = "";
                        this.oldUsername = "";
                    } else {
                        this.username = user.username;
                        this.oldUsername = user.username;
                    }
                    this.email = user.email;
                }).catch(() => {
                this.$notify(this.$t("error.connexion_problem"));
            });
        },
        changeProfile() {
            this.modificationActivated = true;
        },
        validateProfile() {
            if (this.username != this.oldUsername) {
                if (this.username.length === 0) {
                    this.username = null;
                }
                this.$service.user.updateProfile(this.username)
                    .then((user) => {
                        if (user.username === null) {
                            this.username = "";
                            this.oldUsername = "";
                            this.$eventBus.$emit(EventEnum.REFRESH_BANNER_TITLE, user.email);
                        } else {
                            this.username = user.username;
                            this.oldUsername = user.username;
                            this.$eventBus.$emit(EventEnum.REFRESH_BANNER_TITLE, user.username);
                        }
                    }).catch(() => {
                    this.$eventBus.$emit(EventEnum.ERROR_ACTION);
                });
            }
            this.modificationActivated = false;
        },
        logMeOut() {
            this.$service.auth.logOut()
                .then(() => {
                    this.$store.commit("SET_OPEN_CARD", CardEnum.NONE);
                    this.$router.push("/login");
                    this.$notify(this.$t("success.logout"));
                }).catch(() => {
                this.$eventBus.$emit(EventEnum.ERROR_ACTION);
            });
        },
        resetPassword() {
            this.$service.auth.resetPassword(this.email)
                .then(() => {
                    this.$notify(this.$t("success.password_reset"));
                    this.$service.auth.logOut()
                        .then(() => {
                            this.$store.commit("SET_OPEN_CARD", CardEnum.NONE);
                            this.$router.push("/login");
                        }).catch(() => {
                        this.$eventBus.$emit(EventEnum.ERROR_ACTION);
                    });
                }).catch(() => {
                this.$eventBus.$emit(EventEnum.ERROR_ACTION);
            });
        },
        closeOverlay() {
            this.$emit("close");
        }
    }
});
</script>