import Invitation from "@/data/models/api/Invitation";
import Language from "@/data/models/api/Language";
import ProjectUser from "@/data/models/api/ProjectUser";
import RoleProtection from "@/data/models/roles/RoleProtection";
import Project from "@/data/models/api/Project";

export interface State {
  applicationReady: boolean;
  actualProjectId: number;
  user: any;
  actualLanguage: Language;
  actualGroupId: number;
  targetUser: ProjectUser;
  invitations: Invitation[];
  actualRole: RoleProtection;
  currentProject: Project;
  searchProject: string;
  searchTranslation: string;
}


export default {
  applicationReady: false,
  actualProjectId: -1,
  user: null,
  actualLanguage: null,
  targetUser: null,
  invitations: [],
  actualRole: null,
  currentProject: null,
  searchProject: "",
  searchTranslation: "",
}