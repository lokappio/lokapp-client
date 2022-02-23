<template>
  <div>
    <v-dialog v-model="dialogOpened" scrollable transition="dialog-bottom-transition" max-width="600px">
      <template v-slot:activator="{ on }">
        <v-badge :value="nbOfInvitations > 0" color="red" dot overlap>
          <v-btn v-on="on" x-small fab depressed color="primary">
            <v-icon color="white">mdi-bell-ring</v-icon>
          </v-btn>
        </v-badge>
      </template>

      <v-card>
        <v-card-title>
          {{ $t("invitations.title") }}
          <v-spacer></v-spacer>
          <v-icon @click="dialogOpened = false" color="black">mdi-close</v-icon>
        </v-card-title>

        <v-card-text class="list-invitations-style">
          <v-list v-if="nbOfInvitations > 0">
            <v-list-item class="px-0" v-for="invitation in invitations" :key="invitation.id">
              <v-list-item-content>
                <v-list-item-title v-if="invitation.ownerUsername" v-text="$t('invitations.item_owner', { owner: invitation.ownerUsername, project: invitation.projectName })"></v-list-item-title>
                <v-list-item-title v-else v-text="$t('invitations.item_no_owner', { project: invitation.projectName })"></v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-container class="justify-center">
                  <v-row>
                    <v-col class="pa-0 pr-1" cols="6">
                      <v-btn @click="acceptInvitation(invitation)" depressed color="primary">
                        <v-icon>mdi-check</v-icon>
                      </v-btn>
                    </v-col>
                    <v-col class="pa-0 pl-1" cols="6">
                      <v-btn @click="declineInvitation(invitation)" depressed outlined color="primary">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-list-item-action>
            </v-list-item>
          </v-list>

          <span v-else>{{ $t('invitations.no_invitations') }}</span>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Invitation from "@/data/models/api/Invitation";
import Vue from "vue";

export default Vue.extend({
  name: "invitations-button",
  created() {
    this.refreshInvitations();
  },
  data() {
    return {
      timer: null,
      invitations: [],
      dialogOpened: false
    };
  },
  methods: {
    refreshInvitations() {
      this.$service.invitations.getInvitations()
          .then((invitations: Invitation[]) => {
            this.$store.commit("SET_INVITATIONS", invitations);
            this.invitations = invitations;

            if(invitations.length === 0) this.dialogOpened = false;
          });
    },
    acceptInvitation(invitation: Invitation) {
      this.$service.invitations.acceptInvitation(invitation)
          .catch(() => this.$notify(this.$t("errors.unknown_error").toString(), {color: "red"}))
          .finally(() => {
            this.refreshInvitations();
            this.refreshProjects();
          });
    },
    declineInvitation(invitation: Invitation) {
      this.$service.invitations.declineInvitation(invitation)
          .catch(() => this.$notify(this.$t("errors.unknown_error").toString(), {color: "red"}))
          .finally(() => this.refreshInvitations());
    },
    refreshProjects(): void {
      this.$emit("refreshProjects");
    }
  },
  computed: {
    nbOfInvitations() {
      return this.$store.getters.invitations.length;
    }
  }
});
</script>