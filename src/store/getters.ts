import Invitation from "@/data/models/api/Invitation";
import Language from "@/data/models/api/Language";
import ProjectUser from "@/data/models/api/ProjectUser";
import CardEnum from "@/data/models/Card.enum";
import RoleProtection from "@/data/models/roles/RoleProtection";
import {State} from "@/store/states";
import Project from "@/data/models/api/Project";

export default {
  user: (state: State): any => state.user,
  applicationReady: (state: State): boolean => state.applicationReady,
  actualProjectId: (state: State): number => state.actualProjectId,
  currentProject: (state: State): Project => state.currentProject,
  openCard: (state: State): CardEnum => state.openCard,
  actualLanguage: (state: State): Language => state.actualLanguage,
  invitations: (state: State): Invitation[] => state.invitations,
  actualRole: (state: State): RoleProtection => state.actualRole
}