import Invitation from "@/data/models/api/Invitation";
import Language from "@/data/models/api/Language";
import {State} from "@/store/states";
import Project from "@/data/models/api/Project";
import Key from "@/data/models/api/Key";
import Group from "@/data/models/api/Group";
import ProjectUser from "@/data/models/api/ProjectUser";
import Value from "@/data/models/api/Value";

export default {
    SET_USER(state: State, user: any): void {
        state.user = user;
    },
    SET_APP_USER(state: State, user: ProjectUser): void {
        state.appUser = user;
    },
    UPDATE_APP_USER(state: State, user: ProjectUser): void {
        state.appUser.username = user.username;
    },
    SET_CAN_RETRIEVE_USER(state: State, value: boolean): void {
        state.canRetrieveUser = value;
    },
    SET_APPLICATION_READY(state: State): void {
        state.applicationReady = true;
    },
    SET_CURRENT_PROJECT(state: State, project: Project): void {
        state.currentProject = project;
    },
    UPDATE_CURRENT_PROJECT_PARAMETERS(state: State, project: Project): void {
        state.currentProject.color = project.color;
        state.currentProject.name = project.name;
        state.currentProject.description = project.description;
    },
    ADD_PROJECT_KEY(state: State, data: {group: Group | null; key: Key}): void {
        state.currentProject.addKey(data.group, data.key);
        state.currentProject = Object.assign(Project.map({}), state.currentProject);
    },
    UPDATE_PROJECT_KEY(state: State, key: Key): void {
        state.currentProject.updateKey(key);
        state.currentProject = Object.assign(Project.map({}), state.currentProject);
    },
    UPDATE_PROJECT_VALUE(state: State, value: Value): void {
        state.currentProject.updateValue(value);
        state.currentProject = Object.assign(Project.map({}), state.currentProject);
    },
    UPDATE_PROJECT_LANGUAGES(state: State, data: {language: Language; values: Value[]}): void {
        state.currentProject.updateLanguages(data);
    },
    DELETE_PROJECT_KEY(state: State, key: Key): void {
        state.currentProject.deleteKey(key);
        state.currentProject = Object.assign(Project.map({}), state.currentProject);
    },
    DELETE_PROJECT_LANGUAGE(state: State, language: Language): void {
        state.currentProject.deleteLanguage(language);
        state.currentProject = Object.assign(Project.map({}), state.currentProject);
    },
    SET_ACTUAL_LANGUAGE(state: State, language: Language): void {
        state.actualLanguage = language;
    },
    SET_INVITATIONS(state: State, invitations: Invitation[]): void {
        state.invitations = invitations;
    },
    SET_SEARCH_PROJECT(state: State, value: string): void {
        state.searchProject = value;
    },
    SET_SEARCH_TRANSLATION(state: State, value: string): void {
        state.searchTranslation = value;
    },
}