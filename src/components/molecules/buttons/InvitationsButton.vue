<template>
    <v-dialog v-if="nbOfInvitations > 0" v-model="opened" scrollable transition="dialog-bottom-transition" max-width="600px">
        <template v-slot:activator="{ on, attrs }">
            <v-badge avatar color="red" offset-x="15" offset-y="15">
                    <v-btn v-on="on" v-bind="attrs" class="rounded-button-style icon-color" icon>
                        <v-icon class="icon-color">mdi-bell-ring</v-icon>
                    </v-btn>
            </v-badge>
        </template>
        <v-card>
            <v-card-title>
                {{ $t("invitations.title") }}
                <v-spacer></v-spacer>
                <v-icon @click="opened = !opened" color="black">mdi-close</v-icon>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="list-invitations-style">
                <v-list>
                    <v-list-item class="px-0" v-for="invitation in invitations" :key="invitation.id">
                        <v-list-item-content>
                            <v-list-item-title v-if="invitation.ownerUsername" v-text="$t('invitations.item_owner', { owner: invitation.ownerUsername, project: invitation.projectName })"></v-list-item-title>
                            <v-list-item-title v-else v-text="$t('invitations.item_no_owner', { project: invitation.projectName })"></v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-container class="justify-center">
                                <v-row>
                                    <v-col class="pa-0 pr-1" cols="6">
                                        <v-btn @click="acceptInvitation(invitation)" color="success">
                                            <v-icon>mdi-check</v-icon>
                                        </v-btn>
                                    </v-col>
                                    <v-col class="pa-0 pl-1" cols="6">
                                        <v-btn @click="declineInvitation(invitation)" color="error">
                                            <v-icon>mdi-close</v-icon>
                                        </v-btn>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-list-item-action>
                    </v-list-item>
                </v-list>
            </v-card-text>
      </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Invitation from '@/data/models/api/Invitation';
import Vue from 'vue'

export default Vue.extend({
    name: "invitations-button",
    created() {
        this.refreshInvitations();
    },
    data() {
        return {
            opened: false,
            timer: null,
            invitations: []
        }
    },
    methods: {
        refreshInvitations() {
            this.$service.invitations.getInvitations()
            .then((invitations: Invitation[]) => {
                this.$store.commit("SET_INVITATIONS", invitations);
                this.invitations = invitations;
            });
        },
        acceptInvitation(invitation: Invitation) {
            this.$service.invitations.acceptInvitation(invitation)
            .then(() => {
                this.$notify(this.$t("success.invitation_accepted") as string);
            }).catch(() => {
                this.$notify(this.$t("errors.unknown_error") as string);
            }).finally(() => {
                this.refreshInvitations();
            })
        },
        declineInvitation(invitation: Invitation) {
            this.$service.invitations.declineInvitation(invitation)
            .then(() => {
                this.$notify(this.$t("success.invitation_declined") as string);
            }).catch(() => {
                this.$notify(this.$t("errors.unknown_error") as string);
            }).finally(() => {
                this.refreshInvitations();
            })
        },
    },
    computed: {
        nbOfInvitations() {
            return this.$store.getters.invitations.length;
        }
    }
})
</script>

<style lang="scss" scoped>
    .rounded-button-style {
        height: 50px !important;
        width: 50px !important;
        border-radius: 50%;
    }
    .icon-color {
        background-color: #02188C !important;
        color: white !important;
    }
    .list-invitations-style {
        height: 300px;
        overflow-y: auto;
    }
</style>