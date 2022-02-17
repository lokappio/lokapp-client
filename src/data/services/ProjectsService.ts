import config from "@/config";
import {AxiosResponse} from "axios";
import ProjectUser from "../models/api/ProjectUser";
import {Role} from "../models/roles/role.enum";
import ApiService from "./ApiService";
import Project from "@/data/models/api/Project";
import GroupsService from "@/data/services/GroupsService";
import Group from "@/data/models/api/Group";
import KeysService from "@/data/services/KeysService";
import Key from "@/data/models/api/Key";
import ValuesService from "@/data/services/ValuesService";
import Value from "@/data/models/api/Value";
import LanguagesService from "@/data/services/LanguagesService";

class ProjectsService {
  static projectsUrl: string = config.baseUrl + "/projects";

  public static getProjects(): Promise<Project[]> {
    return ApiService.getAPI(ProjectsService.projectsUrl)
      .then((response) => response.data.map((item: any) => Project.map(item)));
  }

  public static async createProject(project: Project, language: string): Promise<Project> {
    const result = await ApiService.postAPI(ProjectsService.projectsUrl, {...project.toCreate(), language});
    return Project.map(result.data);
  }

  public static getProjectById(projectId: number): Promise<Project> {
    return ApiService.getAPI(ProjectsService.projectsUrl + "/" + projectId)
      .then((response) => Project.map(response.data));
  }

  public static getEntireProjectById(projectId: number): Promise<Project> {
    return this.getProjectById(projectId)
      .then(async (response) => {
        response.languages = await LanguagesService.getLanguages(projectId);
        const keys: Key[] = await KeysService.getKeys(projectId);

        //Set values for each keys
        await Promise.all(
          keys.map(async (key) => {
            const values: Value[] = await ValuesService.getValuesByKeyId(key.id, projectId);
            key.values = values;
          })
        );


        const groups: Group[] = await GroupsService.getGroups(projectId);
        groups.forEach((group) => group.keys = keys.filter((key) => key.groupId == group.id));
        response.groups = groups;

        return response;
      });
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