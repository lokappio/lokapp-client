<template>
    <v-menu :nudge-width="200" transition="slide-x-transition">
        <template v-slot:[`activator`]="{on, attrs}">
            <v-btn color="black" class="full-contain-icon" v-bind="attrs" v-on="on" @click="askRoleToBackend" icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
        </template>
        <v-list>
            <v-list-item v-for="(item, i) in items" :key="i">
                <v-list-item-title class="set-cursor-pointer" :style="item.deprecated ? 'color: red': ''" @click="item.callback">{{ item.title }}</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script lang="ts">
import EventEnum from "@/data/enum/event-bus.enum";
import CardEnum from "@/data/models/Card.enum";
import { getRoleClass, getRoleEnum } from "@/data/models/roles/role.enum";
import Vue from "vue";

export default Vue.extend({
    name: 'project-settings-button',
    props: {projectId: Number},
    data() {
        return {
            items: [],
            roleProtection: null
        }
    },
    methods: {
        setupItemsWithRole(role) {
            this.roleProtection = getRoleClass(role);
            this.items = [];
            if (this.roleProtection.canWriteUser || this.roleProtection.canWriteInvitation) {
                this.items.push({
                    title: this.$t("dropdown.users"),
                    callback: () => {
                        this.$store.commit("SET_OPEN_CARD", CardEnum.MANAGE_USERS);
                        //this.$store.commit("SET_ACTUAL_PROJECT_ID", this.projectId);
                    }
                });
            }
            if (this.roleProtection.canWriteLanguage) {
                this.items.push({
                    title: this.$t("dropdown.languages"),
                    callback: () => {
                        this.$store.commit("SET_OPEN_CARD", CardEnum.MANAGE_LANGUAGE);
                        //this.$store.commit("SET_ACTUAL_PROJECT_ID", this.projectId);
                    }
                });
            }
            if (this.roleProtection.canWriteProject) {
                this.items.push({
                    title: this.$t("dropdown.project"),
                    callback: () => {
                        this.$store.commit("SET_OPEN_CARD", CardEnum.MANAGE_PROJECT);
                        //this.$store.commit("SET_ACTUAL_PROJECT_ID", this.projectId);
                    }
                });
            }
            if (this.roleProtection.canDeleteProject) {
                this.items.push({
                    title: this.$t("dropdown.delete_project"),
                    deprecated: true,
                    callback: () => {
                        this.$store.commit("SET_OPEN_CARD", CardEnum.DELETE_PROJECT);
                        //this.$store.commit("SET_ACTUAL_PROJECT_ID", this.projectId);
                    }
                });
            } else {
                this.items.push({
                    title: this.$t("dropdown.leave_project"),
                    deprecated: true,
                    callback: () => {
                        this.$store.commit("SET_OPEN_CARD", CardEnum.LEAVE_PROJECT);
                        //this.$store.commit("SET_ACTUAL_PROJECT_ID", this.projectId);
                    }
                });
            }
        },
        askRoleToBackend() {
            this.$service.user.getMyselfInProject(this.projectId)
            .then((response) => {
                this.setupItemsWithRole(getRoleEnum(response.data.role));
            }).catch(() => {
                this.$eventBus.$emit(EventEnum.ERROR_GET_SOMETHING);
            });
        }
    },
    created() {
        this.askRoleToBackend();
    }
})
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';

.set-cursor-pointer {
    cursor: pointer;
}

</style>