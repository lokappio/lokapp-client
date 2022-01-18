<template>
  <div>
    <v-dialog v-model="dialogOpenedUser" max-width="800px">
      <user-management :dialog-opened="dialogOpenedUser" :project-id="project.id" @close="() => this.dialogOpenedUser = false"/>
    </v-dialog>

    <v-dialog v-model="dialogOpenedLanguage" width="500px">
      <language-management :dialog-opened="dialogOpenedLanguage" :project-id="project.id" @close="() => this.dialogOpenedLanguage = false"/>
    </v-dialog>

    <v-dialog v-model="dialogOpenedProject" width="500px">
      <project-management
          :dialog-opened="dialogOpenedProject"
          :project="project"
          @close="() => this.dialogOpenedProject = false"
          @projectUpdated="projectUpdated"
      />
    </v-dialog>

    <v-dialog v-model="dialogOpenedDelete" width="500px">
      <delete-project :dialog-opened="dialogOpenedDelete" :project="project" @close="() => this.dialogOpenedDelete = false"/>
    </v-dialog>

    <v-dialog v-model="dialogOpenedLeave" width="500px">
      <leave-project :dialog-opened="dialogOpenedLeave" :project-id="project.id" @close="() => this.dialogOpenedLeave = false"/>
    </v-dialog>

    <v-menu :nudge-width="200" transition="slide-x-transition">
      <template v-slot:[`activator`]="{on, attrs}">
        <v-btn color="black" class="full-contain-icon" v-bind="attrs" v-on="on" @click="getMe" icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(item, i) in actions" :key="i">
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
      dialogOpenedLeave: false
    };
  },
  created() {
    this.getMe();
  },
  computed: {
    actions(): any[] {
      const ability: RoleProtection = this.$store.getters.appUser.roleAbility;
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
    }
  },
  methods: {
    getMe() {
      this.$service.user.getMyselfInProject(this.project.id)
          .then((user) => this.$store.commit("SET_APP_USER", user));
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

<style lang="scss" scoped>
@import '~vuetify/src/styles/styles.sass';

.set-cursor-pointer {
  cursor: pointer;
}
</style>