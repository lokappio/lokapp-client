<template>
    <v-card color="white" class="pa-4 pa-md-7 card-style-project">
        <v-container class="pa-0">
            <!-- Title -->
            <v-row :style="{ 'height':'50px' }">
                <v-col cols="11">
                    <h2 class="title-h2">
                        {{ this.$t("invitation_creation.title") }}
                    </h2>
                </v-col>
                <v-col cols="1" class="pr-0">
                    <v-icon @click="closeOverlay" color="black" class="float-right">mdi-close</v-icon>
                </v-col>
            </v-row>

            <keyboard-events :enter="inviteUser"/>
            <v-form ref="formCreateInvitation" onSubmit="return false;">
                <!-- Email -->
                <v-row class="ma-0">
                    <v-col cols="12" class="pl-0 pb-0">
                        <span class="title-h3">{{ $t("invitation_creation.email_title") }}</span>
                    </v-col>
                </v-row>
                <v-row class="ma-0">
                    <v-col cols="12" class="pb-0 pt-1 px-0">
                        <v-text-field :rules="emailRules" class="custom-text-field" background-color="#F2F3F7" v-model="email" :label="$t('invitation_creation.email_label')" type="email" solo flat
                                      required></v-text-field>
                    </v-col>
                </v-row>

                <!-- Role -->
                <v-row class="ma-0 pt-0">
                    <v-col cols="12" class="pl-0 py-0">
                        <span class="title-h3">{{ $t("invitation_creation.role_title") }}
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                        icon
                                        v-bind="attrs"
                                        v-on="on"
                                    >
                                        <v-icon class="mb-1" color="black">mdi-information-outline</v-icon>
                                    </v-btn>
                                </template>

                                <p>{{ $t("invitation_creation.description_owner") }}<br/>
                                {{ $t("invitation_creation.description_manager") }}<br/>
                                {{ $t("invitation_creation.description_editor") }}<br/>
                                {{ $t("invitation_creation.description_translator") }}</p>
                            </v-tooltip>
                        </span>
                    </v-col>
                </v-row>
                <v-row class="ma-0">
                    <v-col cols="12" class="pb-0 pt-1 px-0">
                        <v-select :label="$t('invitation_creation.role_label')" light solo v-model="role" :items="roles" item-text="text" item-value="value"></v-select>
                    </v-col>
                </v-row>

                <action-button :text="$t('invitation_creation.confirm_button')" :handler="inviteUser" block/>
            </v-form>
        </v-container>
    </v-card>
</template>

<script lang="ts">
import {getRoleEnum, Role} from "@/data/models/roles/role.enum";
import {userEmailRules} from "@/data/rules/UserRules";
import Vue from "vue";
import KeyboardEvents from "../../KeyboardEvents.vue";

export default Vue.extend({
    name: "invitation-creation",
    components: {KeyboardEvents},
    props: {projectId: Number, dialogOpened: Boolean},
    data() {
        return {
            email: "",
            emailRules: userEmailRules(this.$t("rules.required") as string, this.$t("rules.mail_valid") as string),
            roles: [],
            role: null,
            loading: false,
        };
    },
    watch: {
        dialogOpened: {
            immediate: true,
            handler: function (isOpened) {
                if (isOpened) {
                    //ON RE-OPENED, RESET DATA
                    this.email = "";
                    this.role = null;
                    this.roles = this.constructRoles();
                }
            }
        }
    },
    methods: {
        constructRoles(): any[] {
            const res: any[] = [];
            Object.values(Role).forEach((role: string) => {
                if (role === Role.OWNER) {
                    return;
                }
                res.push({
                    text: this.$t(`users_manage.role_${getRoleEnum(role)}`),
                    value: role
                });
            });
            return res;
        },
        closeOverlay() {
            this.$emit("closeInvitation");
        },
        inviteUser() {
            if ((this.$refs.formCreateInvitation as any).validate() === true) {
                if (this.role === null || this.role === "") {
                    this.$notify(this.$t("errors.enter_role") as string);
                }
                this.loading = true;
                this.$service.invitations.createInvitation(this.projectId, this.email, this.role)
                    .then(() => {
                        this.$notify(this.$t("success.invitation_created") as string);
                        this.closeOverlay();
                    }).catch(() => {
                    this.$notify(this.$t("errors.unknown_error") as string);
                    this.email = "";
                    this.role = null;
                }).finally(() => {
                    this.loading = false;
                });
            }
        }
    }
});
</script>