import Invitation from "@/data/models/api/Invitation";
import Language from "@/data/models/api/Language";
import RoleProtection from "@/data/models/roles/RoleProtection";
import {State} from "@/store/states";
import Project from "@/data/models/api/Project";

export default {
  user: (state: State): any => state.user,
  applicationReady: (state: State): boolean => state.applicationReady,
  actualProjectId: (state: State): number => state.actualProjectId,
  currentProject: (state: State): Project => state.currentProject,
  actualLanguage: (state: State): Language => state.actualLanguage,
  invitations: (state: State): Invitation[] => state.invitations,
  actualRole: (state: State): RoleProtection => state.actualRole
}