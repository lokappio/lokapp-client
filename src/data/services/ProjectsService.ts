import config from "@/config";
import {AxiosResponse} from "axios";
import ProjectUser from "../models/api/ProjectUser";
import {Role} from "../models/roles/role.enum";
import ApiService from "./ApiService";
import Project from "@/data/models/api/Project";
import Language from "@/data/models/api/Language";
import ImportItem from "@/data/models/ImportItem";
import ImportService from "@/data/services/ImportService";
import Group from "@/data/models/api/Group";
import GroupsService from "@/data/services/GroupsService";
import KeysService from "@/data/services/KeysService";
import ValuesService from "@/data/services/ValuesService";
import LanguagesService from "@/data/services/LanguagesService";
import {DEFAULT_GROUP_NAME} from "@/data/helpers/constants";

class ProjectsService {
  static projectsUrl: string = config.baseUrl + "/projects";

  public static getProjects(): Promise<Project[]> {
    return ApiService.getAPI(ProjectsService.projectsUrl)
      .then((response) => response.data.map((item: any) => Project.map(item)));
  }

  public static async createProject(project: Project, languages: string[]): Promise<Project> {
    const result = await ApiService.postAPI(ProjectsService.projectsUrl, {...project.toCreate(), languages});
    return Project.map(result.data);
  }

  public static async importProject(project: Project, items: ImportItem[]): Promise<number> {
    project.languages = items.map((item) => Language.map({name: item.language}));
    project.groups = [];

    const projectImport = await ImportService.importFromFiles(project, items);

    const createdProject = await this.createProject(project, items.map((item) => item.language));
    createdProject.languages = await LanguagesService.getLanguages(createdProject.id);
    createdProject.groups = await GroupsService.getGroups(createdProject.id);

    // DO NOT CREATE GROUP WITH NAME "COMMON" 'CAUSE IT IS AUTOMATICALLY CREATED WHEN CREATING PROJECT
    await Promise.all(projectImport.groups.map(async (group) => {
      const createdGroup = group.isDefault ?
        createdProject.groups.find((item) => item.name === DEFAULT_GROUP_NAME) :
        await GroupsService.createGroup(group, createdProject.id);

      await Promise.all(group.keys.map(async (key) => {
        const createdKey = await KeysService.createKey(
          key,
          createdGroup,
          createdProject.id,
          key.values.map((value) => {
            value.languageId = createdProject.languages.find((language) => language.name === value.languageName).id
            return value;
          })
        );
      }));
    }));

    localStorage.setItem(createdProject.id.toString(), JSON.stringify(projectImport.warnings));
    return createdProject.id;
  }

  public static async getEntireProjectById(projectId: number): Promise<Project> {
    return await ApiService.getAPI(`${ProjectsService.projectsUrl}/${projectId}/details`)
      .then((response) => Project.mapEntire(response.data));
  }


  public static changeProjectSettings(project: Project): Promise<Project | void> {
    const bodyParameters = {
      name: project.name,
      color: project.color,
      description: project.description
    };

    return ApiService.putAPI(ProjectsService.projectsUrl + "/" + project.id, bodyParameters)
      .then((response) => Project.map(response.data))
      .catch((error) => {
        if (error.response) {
          switch (error.response.status) {
            case 403:
              throw "error.unauthorized";
          }
        }
      });
  }

  public static deleteProject(projectID: number): Promise<AxiosResponse> {
    return ApiService.delAPI(ProjectsService.projectsUrl + "/" + projectID);
  }

  public static leaveProject(projectId: number): Promise<AxiosResponse> {
    return ApiService.postAPI(`${ProjectsService.projectsUrl}/${projectId}/leave`, {});
  }

  public static getUsersOfProject(projectId: number): Promise<Array<ProjectUser>> {
    return ApiService.getAPI(`${ProjectsService.projectsUrl}/${projectId}/users`)
      .then((response) => response.data.map((item: any) => ProjectUser.map(item)));
  }

  public static updateRoleOfUser(projectId: number, targetId: string, role: Role): Promise<ProjectUser | void> {
    const bodyParameters = {
      "role": role as string
    };
    return ApiService.patchAPI(`${ProjectsService.projectsUrl}/${projectId}/users/${targetId}`, bodyParameters)
      .then((response) => ProjectUser.map(response.data))
      .catch((error) => {
        if (error.response) {
          switch (error.response.status) {
            case 403:
              throw "errors.unauthorized";
            default:
              throw "errors.unknown_error";
          }
        }
      });
  }

  public static removeUserFromProject(projectId: number, targetId: string): Promise<any> {
    return ApiService.delAPI(`${ProjectsService.projectsUrl}/${projectId}/users/${targetId}`).catch((error) => {
      if (error.response) {
        switch (error.response.status) {
          case 403:
            throw "errors.unauthorized";
          default:
            throw "errors.unknown_error";
        }
      }
    });
  }
}

export default ProjectsService;