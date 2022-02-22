<template>
    <v-card color="white" width="100%" class="pa-4 pa-md-7 custom-cards">
        <!-- Title and close -->
        <v-icon @click="closeOverlay" color="black" class="float-right">mdi-close</v-icon>

        <v-card-title class="title-style d-flex justify-space-around">{{ $t("project_delete.title", {name: this.project.name}) }}</v-card-title>

        <!-- Confirmation text -->
        <v-card-text class="pb-0">
            <div class="field text-center">{{ $t("project_delete.description_1", { "value": this.project.name }) }}</div>
            <div class="field text-center">{{ $t("project_delete.description_2") }}</div>
        </v-card-text>

        <!-- Buttons -->
        <v-card-actions class="mt-0 pt-0">
            <v-container class="py-0">
                <v-row class="mt-2 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :loading="loading" :handler="deleteProject" :text="$t('project_delete.confirm_button').toString()"/>
                    </v-col>
                </v-row>
                <v-row class="mt-2 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :loading="loading" :handler="closeOverlay" :text="$t('project_delete.cancel_button').toString()"/>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-actions>

    </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Project from "@/data/models/api/Project";

export default Vue.extend({
    name: "delete-project",
    props: {project: Project, dialogOpened: Boolean, fromDetails: Boolean},
    data() {
        return {
            loading: false,
        }
    },
    methods: {
        closeOverlay(): void {
            this.$emit("close");
        },
        deleteProject() {
            this.loading = true;
            this.$service.projects.deleteProject(this.project.id)
            .then(() => {
                if(this.fromDetails) {
                  this.$router.push("/dashboard");
                } else {
                  this.$emit("projectDeleted");
                }

                this.closeOverlay();
            }).catch(() => {
                this.$notify(this.$t("errors.project_deleted").toString(),{color: "red"});
            }).finally(() => {
                this.loading = false;
            });
        }
    }
})
</script>