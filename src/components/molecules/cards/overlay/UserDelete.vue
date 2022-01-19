<template>
    <v-card color="white" class="pa-4 pa-md-7 card-style-project">

            <!-- Title and close -->
            <v-icon @click="closeOverlay" color="black" class="float-right">mdi-close</v-icon>

            <v-card-title class="title-style d-flex justify-space-around">
                {{ $t("user_delete.title", { name: this.user.username ? this.user.username : $t("user_delete.user") }) }}
            </v-card-title>

            <!-- Confirmation text -->
            <v-card-text class="pb-0">
                <div class="field text-center">{{ $t("user_delete.description_1") }}</div>
            </v-card-text>

            <!-- Buttons -->
            <v-card-actions>
                <v-container class="pa-0">
                    <v-row class="mt-0 pb-0">
                        <v-col cols="12" class="pb-0 px-0">
                            <action-button block :loading="loading" :handler="deleteUser" :text="$t('user_delete.confirm_button')"/>
                        </v-col>
                    </v-row>
                    <v-row class="mt-2 pb-0">
                        <v-col cols="12" class="pb-0 px-0">
                            <action-button block :loading="loading" :handler="closeOverlay" :text="$t('user_delete.cancel_button')"/>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-actions>

    </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import ProjectUser from "@/data/models/api/ProjectUser";

export default Vue.extend({
    name: "user-delete",
    props: {projectId: Number, user: ProjectUser, dialogOpened: Boolean},
    data() {
        return {
            loading: false,
            project: null,
            projectName: ""
        }
    },
    watch: {
        dialogOpened: {
            immediate: true,
            handler: function (isOpen) {
                if(isOpen) {
                    if (this.user === null) {
                        this.$notify(this.$t("errors.unknown_error") as string);
                        this.closeOverlay();
                    }
                }
            }
        }
    },
    methods: {
        closeOverlay(): void {
            this.$emit("closeDelete");
        },
        deleteUser(): void {
            this.$service.projects.removeUserFromProject(this.projectId, this.user.userId)
            .then(() => {
                this.$notify(this.$t("success.user_delete") as string);
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
                }
            }).finally(() => {
                this.closeOverlay();
            });
        }
    }
})
</script>

<style lang="scss" scoped>
    .card-style-project {
        border-radius: 20px !important;
        width: 400px;
    }
</style>