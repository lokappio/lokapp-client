<template>
    <v-card color="white" width="100%" class="pa-4 pa-md-7 card-style-project">
        <!-- Title and close -->
        <v-icon @click="closeOverlay" color="black" class="float-right">mdi-close</v-icon>

        <v-card-title class="title-style d-flex justify-space-around">{{ $t("project_delete.title", {name: this.projectName}) }}</v-card-title>

        <!-- Confirmation text -->
        <v-card-text class="pb-0">
            <div class="field text-center">{{ $t("project_delete.description_1", { "value": this.projectName }) }}</div>
            <div class="field text-center">{{ $t("project_delete.description_2") }}</div>
        </v-card-text>

        <!-- Buttons -->
        <v-card-actions class="mt-0 pt-0">
            <v-container class="py-0">
                <v-row class="mt-2 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :loading="loading" :handler="deleteProject" :text="$t('project_delete.confirm_button')"/>
                    </v-col>
                </v-row>
                <v-row class="mt-2 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :loading="loading" :handler="closeOverlay" :text="$t('project_delete.cancel_button')"/>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-actions>

    </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionButton from "@/components/molecules/buttons/ActionButton.vue"
import EventEnum from "@/data/enum/event-bus.enum";

export default Vue.extend({
    name: "delete-project",
    components: {ActionButton},
    props: {projectId: Number, dialogOpened: Boolean},
    data() {
        return {
            loading: false,
            project: null,
            projectName: ""
        }
    },
    watch: {
        dialogOpened(isOpen) {
            if(isOpen) {
                this.project = null;
                this.projectName = "";

                this.getProject();
            }
        }
    },
    methods: {
        getProject() {
            this.$service.projects.getProjectById(this.projectId)
                .then((project) => {
                    this.project = project;
                    this.projectName = this.project.name;
                }).catch(() => {
                this.$eventBus.$emit(EventEnum.ERROR_GET_SOMETHING);
            });
        },
        closeOverlay(): void {
            this.$emit("close");
        },
        deleteProject() {
            this.loading = true;
            this.$service.projects.deleteProject(this.projectId)
            .then(() => {
                this.$notify(this.$t("success.project_deleted") as string);
                this.$router.push("/dashboard");
                this.closeOverlay();
            }).catch(() => {
                this.$notify(this.$t("errors.project_deleted") as string);
                this.$eventBus.$emit(EventEnum.ERROR_ACTION);
            }).finally(() => {
                this.loading = false;
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