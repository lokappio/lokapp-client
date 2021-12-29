import Invitation from "@/data/models/api/Invitation";
import Language from "@/data/models/api/Language";
import ProjectUser from "@/data/models/api/ProjectUser";
import CardEnum from "@/data/models/Card.enum";
import RoleProtection from "@/data/models/roles/RoleProtection";
import {State} from "@/store/states";
import Project from "@/data/models/api/Project";
import Key from "@/data/models/api/Key";
import Group from "@/data/models/api/Group";

export default {
    SET_USER(state: State, user: any): void {
        state.user = user;
    },
    SET_APPLICATION_READY(state: State): void {
        state.applicationReady = true;
    },
    SET_ACTUAL_PROJECT_ID(state: State, projectId: number): void {
        state.actualProjectId = projectId;
    },
    SET_CURRENT_PROJECT(state: State, project: Project): void {
        state.currentProject = project;
    },
    ADD_PROJECT_KEY(state: State, data: {group: Group | null; key: Key}): void {
        state.currentProject.addKey(data.group, data.key);
        state.currentProject = Object.assign({}, state.currentProject);
    },
    UPDATE_PROJECT_KEY(state: State, key: Key): void {
        state.currentProject.updateKey(key);
        state.currentProject = Object.assign({}, state.currentProject);
    },
    DELETE_PROJECT_KEY(state: State, key: Key): void {
        state.currentProject.deleteKey(key);
        state.currentProject = Object.assign({}, state.currentProject);
    },
    SET_OPEN_CARD(state: State, card: CardEnum): void {
        state.openCard = card;
    },
    SET_ACTUAL_LANGUAGE(state: State, language: Language): void {
        state.actualLanguage = language;
    },
    SET_INVITATIONS(state: State, invitations: Invitation[]): void {
        state.invitations = invitations;
    },
    SET_ACTUAL_ROLE(state: State, role: RoleProtection): void {
        state.actualRole = role;
    },
    SET_SEARCH_PROJECT(state: State, value: string): void {
        state.searchProject = value;
    },
    SET_SEARCH_TRANSLATION(state: State, value: string): void {
        state.searchTranslation = value;
    },
}