<template>
    <td :colspan="headers.length" class="my-custom-group-header">
       <template v-if="isActive === false" >
            <v-icon color="maincolor" @click="toggle">
                {{ isOpen ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
            </v-icon>
            <span @click="!group.isDefault ? canUpdateGroup() : null">{{ group.name }}</span>
        </template>

        <!-- If it's a group deployed -->
        <template v-if="isActive === true">
            <v-text-field
                v-model="updateName"
                single-line
                hide-details
                autofocus
                v-on:keydown.esc="cancelUpdates"
                v-on:keydown.enter="saveGroup"
                :rules="groupNameRules"
                class="custom-group-text-field">

                <template v-slot:prepend>
                    <v-icon color="maincolor" @click="toggle">
                        {{ isOpen ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                    </v-icon>
                </template>

                <template v-slot:append-outer>
                    <v-btn @click="saveGroup" class="mr-0" color="maincolor">
                        <v-icon color="white" large class="ma-0">mdi-check</v-icon>
                    </v-btn>
                </template>
            </v-text-field>
        </template>
    </td>
</template>

<script lang="ts">
import { groupNameRules } from "@/data/rules/GroupRules";
import Vue from "vue";
import {translationItem} from "@/data/models/types/TranslationTypes";
import Group from "@/data/models/api/Group";

export default Vue.extend({
    name: 'template-group-header',
    props: {
      headers: {},
      group: Group,
      items: translationItem,
      isOpen: Boolean,
      toggle: Function,
      projectId: Number
    },
    data() {
        return {
            isActive: false,
            updateName: this.group.name,
            groupNameRules: groupNameRules(this.$t("rules.required"), this.$t("rules.group_name_length"), this.$t("rules.snake_case_only"))
        }
    },
    methods: {
        canUpdateGroup() {
                this.isActive = this.$store.getters.appUser.roleAbility ? this.$store.getters.appUser.roleAbility.canWriteGroup : false;
        },
        updateGroup(groupId, items) {
            this.group.name = this.updateName;
            items.forEach(item => {
                item.group = this.group.name;
            });
            this.isActive = false;
        },
        cancelUpdates() {
            this.isActive = false;
            this.updateName = this.group.name;
        },
        saveGroup() {
            this.$service.groups.updateGroup(this.projectId, this.group.id, this.updateName)
                .then(() => this.updateGroup())
                .catch((error) => {
                  if (error.response) {
                      switch (error.response.status) {
                          case 422:
                              this.notify(this.$t("errors.group_already_exists"));
                              break;
                          case 404:
                              this.notify(this.$t("errors.not_existing_group"));
                              break;
                          case 403:
                              this.notify(this.$t("errors.unauthorized"));
                              break;
                          default:
                              this.notify(this.$t("errors.unknown-error"));
                              break;
                      }
                  }
                });
        },
    }
});
</script>

<style lang="scss" scoped>
    .my-custom-group-header {
        border-radius: 10px !important;
    }
    .my-custom-group-header span {
        margin-left: 16px;
        font-family: Nobile;
        font-style: normal;
        font-weight: bold;
        font-size: 16px;
        line-height: 18px;
        letter-spacing: 0.05em;
        color: #000000;
    }
    .custom-group-text-field {
        width: 500px;
    }
</style>