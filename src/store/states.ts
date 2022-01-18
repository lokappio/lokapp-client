import Invitation from "@/data/models/api/Invitation";
import Language from "@/data/models/api/Language";
import ProjectUser from "@/data/models/api/ProjectUser";
import Project from "@/data/models/api/Project";
import firebase from "firebase/app";

export interface State {
  applicationReady: boolean;
  user: firebase.User;
  appUser: ProjectUser;
  actualLanguage: Language;
  targetUser: ProjectUser;
  invitations: Invitation[];
  currentProject: Project;
  searchProject: string;
  searchTranslation: string;
}


export default {
  applicationReady: false,
  user: null,
  appUser: null,
  actualLanguage: null,
  targetUser: null,
  invitations: [],
  currentProject: null,
  searchProject: "",
  searchTranslation: "",
}