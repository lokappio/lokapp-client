<template>
  <v-card color="white" class="pa-4 pa-md-7 custom-cards">
    <v-container>
      <!-- Title -->
      <v-row :style="{ 'height':'50px' }">
        <v-col cols="11" class="px-0">
          <h2 class="title-h2">
            {{ this.$t("invitation_creation.title") }}
          </h2>
        </v-col>
        <v-col cols="1" class="pr-0">
          <v-icon @click="closeOverlay" color="black" class="float-right">mdi-close</v-icon>
        </v-col>
      </v-row>

      <v-form ref="formCreateInvitation" onSubmit="return false;">
        <!-- Email -->
        <v-row class="mt-4 pb-0 mb-2">
          <v-col cols="12" class="pl-0 pb-0">
            <span class="title-h3">{{ $t("invitation_creation.email_title") }}</span>
          </v-col>
        </v-row>
        <v-row class="mt-0 mb-2">
          <v-col cols="12" class="pb-0 pt-0 px-0">
            <v-text-field :rules="emailRules" class="custom-text-field" background-color="inputBackground"
                          v-model="email" :label="$t('invitation_creation.email_label')" type="email" solo flat
                          hide-details="auto" required></v-text-field>
          </v-col>
        </v-row>

        <!-- Role -->
        <v-row class="mt-2 mb-1">
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
                    {{ $t("invitation_creation.description_translator") }}<br/>
                    {{ $t("invitation_creation.description_reviewer") }}</p>
                </v-tooltip>
            </span>
          </v-col>
        </v-row>
        <v-row class="mt-0 mb-1">
          <v-col cols="12" class="pb-0 pt-0 px-0">
            <v-select :label="$t('invitation_creation.role_label')" light solo v-model="role" :items="roles"
                      item-text="text" item-value="value"></v-select>
          </v-col>
        </v-row>

          <!-- Source languages -->
          <v-row class="mt-2 mb-1" v-if="canShowSourceAndTargetLanguages">
              <v-col cols="12" class="pl-0 py-0">
                <span class="title-h3">{{ $t("invitation_creation.source_languages_title") }}</span>
              </v-col>
          </v-row>
          <v-row class="mt-0 mb-1" v-if="canShowSourceAndTargetLanguages">
              <v-col cols="12" class="pb-0 pt-0 px-0">
                  <v-select :label="$t('invitation_creation.source_languages_title')" light solo v-model="sourceLanguagesIds" :items="languages"
                            item-text="text" item-value="value" multiple></v-select>
              </v-col>
          </v-row>

          <!-- Target languages -->
          <v-row class="mt-2 mb-1" v-if="canShowSourceAndTargetLanguages">
              <v-col cols="12" class="pl-0 py-0">
                  <span class="title-h3">{{ $t("invitation_creation.target_languages_title") }}</span>
              </v-col>
          </v-row>
          <v-row class="mt-0 mb-1" v-if="canShowSourceAndTargetLanguages">
              <v-col cols="12" class="pb-0 pt-0 px-0">
                  <v-select :label="$t('invitation_creation.target_languages_title')" light solo v-model="targetLanguagesIds" :items="languages"
                            item-text="text" item-value="value" multiple></v-select>
              </v-col>
          </v-row>

        <v-row class="mt-1 pb-0">
          <v-col cols="12" class="pb-0 px-0">
            <action-button :text="$t('invitation_creation.confirm_button')" :handler="inviteUser" block/>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import {getRoleEnum, Role} from "@/data/models/roles/role.enum";
import {userEmailRules} from "@/data/rules/UserRules";
import Vue from "vue";

export default Vue.extend({
  name: "invitation-creation",
  props: {projectId: Number, dialogOpened: Boolean},
  data() {
    return {
      email: "" as string,
      emailRules: userEmailRules(),
      roles: [],
      role: null,
      loading: false,
      sourceLanguagesIds: [],
      targetLanguagesIds: []
    };
  },
  computed: {
    languages(): any[] {
      return this.$store.getters.currentProject.languages.map((language: any) => {
        return {
          text: language.name,
          value: language.id
        }
      });
    },
    canShowSourceAndTargetLanguages(): boolean {
      return this.role === Role.TRANSLATOR || this.role === Role.REVIEWER;
    }
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
          this.sourceLanguagesIds = [];
          this.targetLanguagesIds = [];
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
          this.$notify(this.$t("errors.enter_role").toString(), {color: "red"});
        } else {
          this.loading = true;
          if (!this.canShowSourceAndTargetLanguages) {
              this.sourceLanguagesIds = [];
              this.targetLanguagesIds = [];
          }

          this.$service.invitations.createInvitation(this.projectId, this.email, this.role, this.sourceLanguagesIds, this.targetLanguagesIds)
              .then(() => {
                this.$notify(this.$t("success.invitation_created").toString(), {color: "primary"});
                this.closeOverlay();
                this.$emit('invitationSent');
              })
              .catch((e) => {
                this.$notify(this.$t(e).toString(), {color: "red"});
                this.email = "";
                this.role = null;
              })
              .finally(() => this.loading = false);
        }
      }
    }
  },

});
</script>
