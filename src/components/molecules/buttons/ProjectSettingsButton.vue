<template>
  <div>
    <v-dialog v-model="dialogOpened" max-width="800px">
      <user-management v-if="dialogOpenedUser" :dialog-opened="dialogOpenedUser" :project-id="project.id" @close="() => this.dialogOpenedUser = false"/>

      <language-management v-if="dialogOpenedLanguage" :dialog-opened="dialogOpenedLanguage" :project-id="project.id" @close="() => this.dialogOpenedLanguage = false"/>

      <project-management
          v-if="dialogOpenedProject"
          :dialog-opened="dialogOpenedProject"
          :project="project"
          @close="() => this.dialogOpenedProject = false"
          @projectUpdated="projectUpdated"
      />

      <delete-project
          v-if="dialogOpenedDelete"
          :dialog-opened="dialogOpenedDelete"
          :project="project"
          :from-details="fromStore"
          @close="() => this.dialogOpenedDelete = false"
          @projectDeleted="() => $emit('projectDeleted')"
      />

      <leave-project v-if="dialogOpenedLeave" :dialog-opened="dialogOpenedLeave" :project-id="project.id" @close="() => this.dialogOpenedLeave = false"/>
    </v-dialog>

    <v-menu :nudge-width="200" transition="slide-x-transition">
      <template v-slot:[`activator`]="{on}">
        <v-btn color="black" v-on="on" icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>


      <v-list>
        <v-list-item v-if="loading">
          <v-list-item-title>
            <v-progress-circular size="25" indeterminate color="primary"></v-progress-circular>
          </v-list-item-title>
        </v-list-item>

        <v-list-item v-else v-for="(item, i) in actions" :key="i">
          <v-list-item-title class="set-cursor-pointer" :style="item.important ? 'color: red': ''" @click="item.callback">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import UserManagement from "@/components/molecules/cards/overlay/UserManagement.vue";
import ProjectManagement from "@/components/molecules/cards/overlay/ProjectManagement.vue";
import DeleteProject from "@/components/molecules/cards/overlay/DeleteProject.vue";
import LeaveProject from "@/components/molecules/cards/overlay/LeaveProject.vue";
import LanguageManagement from "@/components/molecules/cards/overlay/LanguageManagement.vue";
import RoleProtection from "@/data/models/roles/RoleProtection";
import Project from "@/data/models/api/Project";

export default Vue.extend({
  name: "project-settings-button",
  components: {UserManagement, ProjectManagement, DeleteProject, LanguageManagement, LeaveProject},
  props: {project: Project, fromStore: Boolean},
  data() {
    return {
      dialogOpenedUser: false,
      dialogOpenedLanguage: false,
      dialogOpenedProject: false,
      dialogOpenedDelete: false,
      dialogOpenedLeave: false,

      currentUserRoleInProject: null as RoleProtection,
      loading: false,
    };
  },
  async created() {
    if(this.fromStore) {
      this.currentUserRoleInProject = this.$store.getters.appUser.roleAbility;
    } else {
      await this.getMe();
    }
  },
  computed: {
    actions(): any[] {
      const ability: RoleProtection = this.currentUserRoleInProject //this.$store.getters.appUser.roleAbility;
      const items = [];

      if (ability.canWriteUser || ability.canWriteInvitation) {
        items.push({
          title: this.$t("dropdown.users"),
          callback: () => this.dialogOpenedUser = true
        });
      }
      if (ability.canWriteLanguage) {
        items.push({
          title: this.$t("dropdown.languages"),
          callback: () => this.dialogOpenedLanguage = true
        });
      }
      if (ability.canWriteProject) {
        items.push({
          title: this.$t("dropdown.project"),
          callback: () => this.dialogOpenedProject = true
        });
      }
      if (ability.canDeleteProject) {
        items.push({
          title: this.$t("dropdown.delete_project"),
          important: true,
          callback: () => this.dialogOpenedDelete = true
        });
      } else {
        items.push({
          title: this.$t("dropdown.leave_project"),
          important: true,
          callback: () => this.dialogOpenedLeave = true
        });
      }

      return items;
    },
    dialogOpened: {
      get(): boolean {
        return this.dialogOpenedUser || this.dialogOpenedLanguage || this.dialogOpenedProject || this.dialogOpenedDelete || this.dialogOpenedLeave;
      },
      set(): void {
        this.dialogOpenedUser= false;
        this.dialogOpenedLanguage= false;
        this.dialogOpenedProject= false;
        this.dialogOpenedDelete= false;
        this.dialogOpenedLeave= false;
      }
    }
  },
  methods: {
    //USED TO RETRIEVE THE ROLE OF THE USER IN THE PROJECT
    getMe() {
      this.loading = true;

      this.$service.user.getMyselfInProject(this.project.id)
          .then((user) => {
            this.currentUserRoleInProject = user.roleAbility;
            this.loading = false;
          });
    },
    projectUpdated(project: Project) {
      if(this.fromStore) {
        this.$store.commit("UPDATE_CURRENT_PROJECT_PARAMETERS", project);
      } else {
        this.$emit("update_projects", project);
      }
    }
  }
});
</script>