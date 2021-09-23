<template>
    <td :colspan="headers.length" class="my-custom-group-header">

        <!-- If it's the basic group with no name -->
        <template v-if="group === ''">
            <v-icon color="maincolor" @click="toggle">
                {{ isOpen ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
            </v-icon>
        </template>

        <!-- If it's a custom group  -->
        <template v-if="group != '' && getGroupById(items[0].groupId).groupActivated === false">
            <v-icon color="maincolor" @click="toggle">
                {{ isOpen ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
            </v-icon>
            <span @click="canUpdateGroup(items[0].groupId)">{{group}}</span>
        </template>

        <!-- If it's a group deployed -->
        <template v-if="group != '' && getGroupById(items[0].groupId).groupActivated === true">
            <v-text-field
                v-model="getGroupById(items[0].groupId).groupUpdatedName"
                single-line 
                autofocus
                v-on:keydown.esc="getGroupById(items[0].groupId).groupActivated = false"
                v-on:keydown.enter="saveGroup(items[0].groupId, items)"
                :rules="groupNameRules"
                class="custom-group-text-field">

                <template v-slot:[`prepend`]>
                    <v-icon color="maincolor" @click="toggle">
                        {{ isOpen ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                    </v-icon>
                </template>

                <template v-slot:[`append-outer`]>
                    <v-btn @click="saveGroup(items[0].groupId, items)" class="mr-0" color="maincolor">
                        <v-icon color="white" large class="ma-0">
                            mdi-check
                        </v-icon>
                    </v-btn>
                </template>
            </v-text-field>
        </template>
    </td>
</template>

<script>
import EventEnum from "@/data/enum/event-bus.enum";
import { groupNameRules } from "@/data/rules/GroupRules";

export default ('template-group-header', {
    props: [
        'headers',
        'group',
        'items',
        'isOpen',
        'toggle',
        'groups',
        'projectId'
    ],
    data() {
        return {
            groupNameRules: groupNameRules(this.$t("rules.required"), this.$t("rules.group_name_length"), this.$t("rules.snake_case_only"))
        }
    },
    methods: {
        canUpdateGroup(groupId) {
            if (this.$store.getters.actualRole.canWriteGroup) {
                this.getGroupById(groupId).groupActivated = true
            }
        },
        getGroupById(id) {
            const actualGroup = this.groups.findIndex((group) => group.groupId === id);
            if (actualGroup === -1) {
                return null;
            }
            return this.groups[actualGroup];
        },
        updateGroup(groupId, items) {
            const group = this.getGroupById(groupId);
            group.groupName = group.groupUpdatedName;
            items.forEach(item => {
                item.group = group.groupName;
            });
            group.groupActivated = false;
        },
        saveGroup(groupId, items) {
            if (this.getGroupById(groupId).groupName === this.getGroupById(groupId).groupUpdatedName) {
                this.getGroupById(groupId).groupActivated = false;
                return;
            }
            this.$service.groups.updateGroup(this.projectId, groupId, this.getGroupById(groupId).groupUpdatedName)
            .then(() => {
                this.updateGroup(groupId, items);
            }).catch((error) => {
                if (error.response) {
                    switch (error.response.status) {
                        case 422:
                            this.notify(this.$t("errors.group_already_exists"));
                            break;
                        case 404:
                            this.notify(this.$t("errors.not_existing_group"));
                            break;
                        case 403:
                            this.$notify(this.$t("errors.unauthorized"));
                            break;
                        default:
                            this.notify(this.$t("errors.unknown-error"));
                            break;
                    }
                }
                this.$eventBus.$emit(EventEnum.ERROR_ACTION);
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