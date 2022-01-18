import Invitation from "@/data/models/api/Invitation";
import Language from "@/data/models/api/Language";
import RoleProtection from "@/data/models/roles/RoleProtection";
import {State} from "@/store/states";
import Project from "@/data/models/api/Project";
import firebase from "firebase/app";
import ProjectUser from "@/data/models/api/ProjectUser";

export default {
  user: (state: State): firebase.User => state.user,
  appUser: (state: State): ProjectUser => state.appUser,
  applicationReady: (state: State): boolean => state.applicationReady,
  currentProject: (state: State): Project => state.currentProject,
  actualLanguage: (state: State): Language => state.actualLanguage,
  invitations: (state: State): Invitation[] => state.invitations,
}