<template>
    <div>
        <v-dialog v-model="openDialogInvitation" width="500px">
            <InvitationCreation :project-id="projectId" :dialog-opened="openDialogInvitation" @closeInvitation="() => this.openDialogInvitation = false"/>
        </v-dialog>

        <v-dialog v-model="openDialogDelete" width="500px">
            <UserDelete :project-id="projectId" :user="userToDelete" :dialog-opened="openDialogDelete" @closeDelete="() => this.openDialogDelete = false"/>
        </v-dialog>

        <v-card color="white" width="100%" class="pa-4 pa-md-7 card-style-project">
            <v-container class="pa-0">
                <!-- Title -->
                <v-row :style="{ 'height':'50px' }">
                    <v-col cols="11">
                        <h2 class="title-h2">
                            {{ this.$t("users_manage.title") }}
                        </h2>
                    </v-col>
                    <v-col cols="1" class="pr-0">
                        <v-icon @click="closeManageUsers" color="black" class="float-right">mdi-close</v-icon>
                    </v-col>
                </v-row>

                <v-list subheader class="mx-0 users-list" two-line>
                    <v-list-item class="px-0" v-for="user in users" :key="user.userId">
                        <v-list-item-content>
                            <v-row align="center">
                                <v-col>
                                    <v-list-item-title v-text="user.email"></v-list-item-title>
                                    <v-list-item-subtitle v-if="user.username" v-text="user.username"></v-list-item-subtitle>
                                </v-col>

                                <v-col cols="5">
                                    <v-select
                                        hide-details="true"
                                        :disabled="isUserUpdateRoleDisabled(user) || user.userId === myself.userId"
                                        light
                                        solo
                                        v-model="user.role"
                                        :items="roles"
                                        item-text="text"
                                        item-value="value"
                                        @change="updateRole(user)"
                                    >
                                        <template v-slot:[`append-outer`]>
                                            <v-btn color="maincolor" icon :disabled="isUserUpdateRoleDisabled(user) || user.userId === myself.userId" @click="deleteUser(user)">
                                                <v-icon color="maincolor">mdi-delete</v-icon>
                                            </v-btn>
                                        </template>
                                    </v-select>
                                </v-col>
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>

                    <v-divider class="my-1" v-if="invitations.length > 0"></v-divider>

                    <v-list-item class="px-0" v-for="invitation in invitations" :key="invitation.userId">
                        <v-list-item-content>
                            <v-row align="center">
                                <v-col>
                                    <v-list-item-title v-text="invitation.email"></v-list-item-title>
                                    <v-list-item-subtitle v-if="invitation.username" v-text="invitation.username"></v-list-item-subtitle>
                                </v-col>

                                <v-col cols="auto">
                                    <v-btn color="error" :disabled="isInvitationDisabled()" @click="deleteInvitation(invitation)">
                                        {{ $t("users_manage.delete_invitation") }}
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

                <v-card-actions class="mt-0 ml-0 pl-0 pb-0 justify-start" v-if="canCreateInvitation()">
                    <v-btn class="pl-0" x-large color="maincolor" icon @click="() => this.openDialogInvitation = true">
                        <v-icon color="maincolor" x-large>mdi-plus-circle</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-container>
        </v-card>
    </div>
</template>

<script lang="ts">
import EventEnum from "@/data/enum/event-bus.enum";
import ProjectUser from "@/data/models/api/ProjectUser";
import CardEnum from "@/data/models/Card.enum";
import {getRoleClass, getRoleEnum, Role} from "@/data/models/roles/role.enum";
import RoleProtection from "@/data/models/roles/RoleProtection";
import Vue from "vue";
import InvitationCreation from "@/components/molecules/cards/overlay/InvitationCreation.vue";
import UserDelete from "@/components/molecules/cards/overlay/UserDelete.vue";

export default Vue.extend({
    name: "user-management",
    components: {UserDelete, InvitationCreation},
    props: {projectId: Number, dialogOpened: Boolean},
    data() {
        return {
            myself: null,
            users: [] as ProjectUser[],
            invitations: [],
            myrole: null,
            roles: [],
            userToDelete: null,
            openDialogInvitation: false,
            openDialogDelete: false,
        };
    },
    watch: {
        dialogOpened: {
            immediate: true,
            handler: function (isOpened) {
                if (isOpened) {
                    //ON RE-OPENED, RESET DATA
                    this.myself = null;
                    this.users = [];
                    this.invitations = [];
                    this.myrole = null;
                    this.roles = [];

                    this.getMyself();
                    this.roles = this.constructRoles();
                }
            }
        }
    },
    methods: {
        constructRoles(): any[] {
            const res: any[] = [];
            Object.values(Role).forEach((role: string) => {
                res.push({
                    text: this.$t(`users_manage.role_${getRoleEnum(role)}`),
                    value: role
                });
            });
            return res;
        },
        deleteInvitation(invitation: ProjectUser) {
            this.$service.invitations.deleteInvitation(this.projectId, invitation.invitationId)
                .then(() => {
                    this.refresh();
                }).catch((error) => {
                if (error.response) {
                    switch (error.response.status) {
                        case 403:
                            this.$notify(this.$t("errors.unauthorized") as string);
                            break;
                        default:
                            this.$notify(this.$t("errors.unknown_error") as string);
                            break;
                    }
                    this.refresh();
                }
            });
        },
        isUserUpdateRoleDisabled(user: ProjectUser): boolean {
            if ((this.myrole as RoleProtection).canWriteUser === false) {
                return true;
            }
            if (user.role === Role.OWNER) {
                return true;
            }
            return false;
        },
        isInvitationDisabled(): boolean {
            if (this.myrole) {
                return !((this.myrole as RoleProtection).canWriteInvitation);
            }
            return false;
        },
        canCreateInvitation(): boolean {
            if (this.myrole) {
                return ((this.myrole as RoleProtection).canWriteInvitation);
            }
            return false;
        },
        closeManageUsers() {
            this.$emit("close");
        },
        getMyself() {
            this.$service.user.getMyselfInProject(this.projectId)
                .then((response: any) => {
                    this.myself = ProjectUser.map(response.data);
                    this.getEveryUsersOfProject();
                    this.myrole = getRoleClass(this.myself.role);
                }).catch(() => {
                this.$notify(this.$t("errors.unknown_error") as string);
                this.$eventBus.$emit(EventEnum.ERROR_GET_SOMETHING);
            });
        },
        getEveryUsersOfProject() {
            this.$service.projects.getUsersOfProject(this.projectId)
                .then((users: ProjectUser[]) => {
                    users.forEach((user: ProjectUser) => {
                        if (user.pending === false) {
                            this.users.push(user);
                        } else {
                            this.invitations.push(user);
                        }
                    });
                    this.users.sort((a: ProjectUser, b: ProjectUser) => {
                        if (a.email < b.email) {
                            return -1;
                        } else if (a.email > b.email) {
                            return 1;
                        }
                        return 0;
                    });
                    this.invitations.sort((a: ProjectUser, b: ProjectUser) => {
                        if (a.email < b.email) {
                            return -1;
                        } else if (a.email > b.email) {
                            return 1;
                        }
                        return 0;
                    });
                }).catch(() => {
                this.$notify(this.$t("errors.unknown_error") as string);
                this.$eventBus.$emit(EventEnum.ERROR_GET_SOMETHING);
            });
        },
        refresh() {
            this.users = [];
            this.invitations = [];
            this.getMyself();
        },
        updateRole(user: ProjectUser) {
            this.$service.projects.updateRoleOfUser(this.projectId, user.userId, user.role)
                .then((userUpdated: ProjectUser) => {
                    user = userUpdated;
                    if (this.myself.role === Role.OWNER && user.role === Role.OWNER) {
                        this.refresh();
                    }
                }).catch((error) => {
                if (error.response) {
                    switch (error.response.status) {
                        case 403:
                            this.$notify(this.$t("errors.unauthorized") as string);
                            break;
                        default:
                            this.$notify(this.$t("errors.unknown_error") as string);
                            break;
                    }
                    this.refresh();
                }
            });
        },
        deleteUser(user: ProjectUser) {
            this.userToDelete = user;
            this.openDialogDelete = true;
        }
    }
});
</script>

<style lang="scss" scoped>
.card-style-project {
    border-radius: 20px !important;
    width: 700px;
}

.users-list {
    color: black;
    background-color: white;
    max-height: 400px; /* or any height you want */
    overflow-y: auto
}

.users-list::v-deep .v-subheader {
    color: black;
}

.users-list::v-deep .v-divider {
    border-color: black;
}

.users-list::v-deep .v-list-item__title {
    color: black;
}

.users-list::v-deep .v-list-item__subtitle {
    color: black;
}
</style>