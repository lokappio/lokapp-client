import _Vue from "vue";
import AuthService from "../services/AuthService";
import ExportService from "../services/ExportService";
import GroupsService from "../services/GroupsService";
import KeysService from "../services/KeysService";
import LanguagesService from "../services/LanguagesService";
import ProjectsService from "../services/ProjectsService";
import UserService from "../services/UserService";
import ValuesService from "../services/ValuesService";
import InvitationsService from "../services/InvitationsService";

export function serviceInjection(Vue: typeof _Vue): void {
  Vue.prototype.$service = {
    auth: AuthService,
    projects: ProjectsService,
    user: UserService,
    languages: LanguagesService,
    keys: KeysService,
    values: ValuesService,
    groups: GroupsService,
    export: ExportService,
    invitations: InvitationsService
  };
}

declare module "vue/types/vue" {
  interface Vue {
    $service: {
      auth: typeof AuthService;
      projects: typeof ProjectsService;
      user: typeof UserService;
      languages: typeof LanguagesService;
      keys: typeof KeysService;
      values: typeof ValuesService;
      groups: typeof GroupsService;
      export: typeof ExportService;
      invitations: typeof InvitationsService;
    };
  }
}
