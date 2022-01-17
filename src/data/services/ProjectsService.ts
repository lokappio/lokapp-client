import config from "@/config";
import { AxiosResponse } from "axios";
import ProjectUser from "../models/api/ProjectUser";
import { Role } from "../models/roles/role.enum";
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
        .then((response) => response.data.map((item: any) => Project.map(item)))
    }

    public static createProject(project: Project, projectLanguage: string): Promise<AxiosResponse<any>> {
        let bodyParameters: any = {};
        bodyParameters = {
            name: project.name,
            color: project.color,
            description: project.description
        };
        if (projectLanguage) {
            bodyParameters["language"] = projectLanguage;
        }
        return ApiService.postAPI(ProjectsService.projectsUrl, bodyParameters);
    }

    public static getProjectById(projectId: number): Promise<Project> {
        return ApiService.getAPI(ProjectsService.projectsUrl + "/" + projectId)
        .then((response) => {
            return Project.map(response.data);
        })
    }

    public static getEntireProjectById(projectId: number): Promise<Project> {
        return this.getProjectById(projectId)
          .then(async (response) => {
              response.languages = await LanguagesService.getLanguages();
              const keys: Key[] = await KeysService.getKeys();

              //Set values for each keys
              await Promise.all(
                keys.map(async (key) => {
                  const values: Value[] = await ValuesService.getValuesByKeyId(key.id);

                  values.forEach((value) => value.languageName = response.languages.find((lang) => lang.id == value.languageId)?.name)
                  key.values = values;
                })
              );


              const groups: Group[] = await GroupsService.getGroups();
              groups.forEach((group) => group.keys = keys.filter((key) => key.groupId == group.id));
              response.groups = groups;

              return response;
          });
    }


    public static changeProjectSettings(projectID: number, projectName: string, projectColor: string, projectDescription: string): Promise<Project> {
        const bodyParameters = {
            name: projectName,
            color: projectColor,
            description: projectDescription
        };
        return ApiService.putAPI(ProjectsService.projectsUrl + "/" + projectID, bodyParameters)
        .then((response) => {
            return Project.map(response.data);
        })
    }

    public static deleteProject(projectID: number): Promise<AxiosResponse<any>>{
        return ApiService.delAPI(ProjectsService.projectsUrl + "/" + projectID);
    }

    public static leaveProject(projectId: number): Promise<AxiosResponse<any>> {
        return ApiService.postAPI(`${ProjectsService.projectsUrl}/${projectId}/leave`, {});
    }

    public static getUsersOfProject(projectId: number): Promise<Array<ProjectUser>> {
        return ApiService.getAPI(`${ProjectsService.projectsUrl}/${projectId}/users`)
        .then((response) => {
            return response.data.map((item: any) => {
                return ProjectUser.map(item);
            })
        });
    }

    public static updateRoleOfUser(projectId: number, targetId: string, role: Role): Promise<ProjectUser> {
        const bodyParameters = {
            "role": role as string
        };
        return ApiService.patchAPI(`${ProjectsService.projectsUrl}/${projectId}/users/${targetId}`, bodyParameters)
        .then((response) => {
            return ProjectUser.map(response.data);
        });
    }

    public static removeUserFromProject(projectId: number, targetId: string): Promise<AxiosResponse<any>> {
        return ApiService.delAPI(`${ProjectsService.projectsUrl}/${projectId}/users/${targetId}`);
    }
}

export default ProjectsService;