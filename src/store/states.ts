import Invitation from "@/data/models/api/Invitation";
import Language from "@/data/models/api/Language";
import ProjectUser from "@/data/models/api/ProjectUser";
import CardEnum from "@/data/models/Card.enum";
import RoleProtection from "@/data/models/roles/RoleProtection";
import Project from "@/data/models/api/Project";

export interface State {
  applicationReady: boolean;
  actualProjectId: number;
  user: any;
  openCard: CardEnum;
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
  openCard: CardEnum.NONE,
  actualLanguage: null,
  actualGroupId: -1,
  targetUser: null,
  invitations: [],
  actualRole: null,
  currentProject: null,
  searchProject: "",
  searchTranslation: "",
}