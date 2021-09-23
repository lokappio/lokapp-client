<template>
    <v-card color="white" class="pa-4 pa-md-7 card-style-project">

        <!-- Title and close -->
        <v-icon @click="closeOverlay" color="black" class="float-right">
            mdi-close
        </v-icon>
        <v-card-title class="title-style d-flex justify-space-around">
            {{ $t("leave_project.title") }}
        </v-card-title>

        <!-- Confirmation text -->
        <v-card-text class="pb-0">
            <div class="field text-center">
            {{ $t("leave_project.description_1") }}
            </div>
            <div class="field text-center">
            {{ $t("leave_project.description_2") }}
            </div>
        </v-card-text>

        <!-- Buttons -->
        <v-card-actions>
            <v-container class="pa-0">
                <v-row class="mt-2 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :loading="loading" :handler="leaveProject" :text="$t('leave_project.confirm_button')"/>
                    </v-col>
                </v-row>
                <v-row class="mt-2 pb-0">
                    <v-col cols="12" class="pb-0 px-0">
                        <action-button block :loading="loading" :handler="closeOverlay" :text="$t('leave_project.cancel_button')"/>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-actions>

    </v-card>
</template>

<script lang="ts">
import EventEnum from "@/data/enum/event-bus.enum";
import CardEnum from '@/data/models/Card.enum';
import ActionButton from "@/components/molecules/buttons/ActionButton.vue";
import Vue from 'vue'

export default Vue.extend({
    name: "leave-project",
    components: {
        ActionButton
    },
    created() {
        this.$service.projects.getSpecificProject(this.$store.getters.actualProjectId)
        .then(project => {
            this.projectName = project.name;
        }).catch(() => {
            this.$eventBus.$emit(EventEnum.ERROR_GET_SOMETHING);
        });
    },
    data() {
        return {
            projectName: "",
            loading: false
        }
    },
    methods: {
        closeOverlay() {
            this.$store.commit("SET_OPEN_CARD", CardEnum.NONE);
        },
        leaveProject() {
            this.loading = true;
            this.$service.projects.leaveProject(this.$store.getters.actualProjectId)
            .then(() => {
                this.$notify(this.$t("success.project_leave") as string);
                this.$eventBus.$emit(EventEnum.BACK_TO_DASHBOARD);
            }).catch(() => {
                this.$notify(this.$t("errors.unknown_error") as string);
                this.$eventBus.$emit(EventEnum.ERROR_ACTION);
            }).finally(() => {
                this.closeOverlay();
                this.loading = false;
            });
        }
    }
})
</script>