<template>
    <div>
        <v-dialog v-model="dialogOpenedUser" width="500px">
            <user-management :dialog-opened="dialogOpenedUser" :project-id="projectId" @close="() => this.dialogOpenedUser = false"/>
        </v-dialog>

        <v-dialog v-model="dialogOpenedLanguage" width="500px">
            <language-management :dialog-opened="dialogOpenedLanguage" :project-id="projectId" @close="() => this.dialogOpenedLanguage = false"/>
        </v-dialog>

        <v-dialog v-model="dialogOpenedProject" width="500px">
            <project-management :dialog-opened="dialogOpenedProject" :project-id="projectId" @close="() => this.dialogOpenedProject = false"/>
        </v-dialog>

        <v-dialog v-model="dialogOpenedDelete" width="500px">
            <delete-project :dialog-opened="dialogOpenedDelete" :project-id="projectId" @close="() => this.dialogOpenedDelete = false"/>
        </v-dialog>

        <v-dialog v-model="dialogOpenedLeave" width="500px">
            <leave-project :dialog-opened="dialogOpenedLeave" :project-id="projectId" @close="() => this.dialogOpenedLeave = false"/>
        </v-dialog>

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
    </div>
</template>

<script lang="ts">
import EventEnum from "@/data/enum/event-bus.enum";
import {getRoleClass, getRoleEnum, Role} from "@/data/models/roles/role.enum";
import Vue from "vue";
import UserManagement from "@/components/molecules/cards/overlay/UserManagement.vue";
import ProjectManagement from "@/components/molecules/cards/overlay/ProjectManagement.vue";
import DeleteProject from "@/components/molecules/cards/overlay/DeleteProject.vue";
import LeaveProject from "@/components/molecules/cards/overlay/LeaveProject.vue";
import LanguageManagement from "@/components/molecules/cards/overlay/LanguageManagement.vue";
import RoleProtection from "@/data/models/roles/RoleProtection";

export default Vue.extend({
    name: 'project-settings-button',
    components: {UserManagement, ProjectManagement, DeleteProject, LanguageManagement, LeaveProject},
    props: {projectId: Number},
    data() {
        return {
            items: [],
            roleProtection: null as RoleProtection,
            dialogOpenedUser: false,
            dialogOpenedLanguage: false,
            dialogOpenedProject: false,
            dialogOpenedDelete: false,
            dialogOpenedLeave: false,
        }
    },
    created() {
        this.askRoleToBackend();
    },
    methods: {
        setupItemsWithRole(role: Role) {
            this.roleProtection = getRoleClass(role);
            this.items = [];

            if (this.roleProtection.canWriteUser || this.roleProtection.canWriteInvitation) {
                this.items.push({
                    title: this.$t("dropdown.users"),
                    callback: () => this.dialogOpenedUser = true
                });
            }
            if (this.roleProtection.canWriteLanguage) {
                this.items.push({
                    title: this.$t("dropdown.languages"),
                    callback: () => this.dialogOpenedLanguage = true
                });
            }
            if (this.roleProtection.canWriteProject) {
                this.items.push({
                    title: this.$t("dropdown.project"),
                    callback: () => this.dialogOpenedProject = true
                });
            }
            if (this.roleProtection.canDeleteProject) {
                this.items.push({
                    title: this.$t("dropdown.delete_project"),
                    deprecated: true,
                    callback: () => this.dialogOpenedDelete = true
                });
            } else {
                this.items.push({
                    title: this.$t("dropdown.leave_project"),
                    deprecated: true,
                    callback: () => this.dialogOpenedLeave = true
                });
            }
        },
        askRoleToBackend() {
            this.$service.user.getMyselfInProject(this.projectId)
                .then((response) => this.setupItemsWithRole(getRoleEnum(response.data.role)))
                .catch(() => this.$eventBus.$emit(EventEnum.ERROR_GET_SOMETHING));
        }
    }
})
</script>

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';

.set-cursor-pointer {
    cursor: pointer;
}

</style>