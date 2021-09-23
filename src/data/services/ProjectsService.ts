import config from "@/config";
import { AxiosResponse } from "axios";
import ProjectList from "../models/api/ProjectList";
import ProjectUser from "../models/api/ProjectUser";
import { Role } from "../models/roles/role.enum";
import ApiService from "./ApiService";

class ProjectsService {
    static projectsUrl: string = config.baseUrl + "/projects";

    public static getProjects(): Promise<Array<ProjectList>> {
        return ApiService.getAPI(ProjectsService.projectsUrl) 
        .then((response) => {
            return response.data.map((item: any) => {
                return ProjectList.map(item);
            });
        })
    }

    public static createProject(project: ProjectList, projectLanguage: string): Promise<AxiosResponse<any>> {
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

    public static getSpecificProject(projectID: number): Promise<ProjectList> {
        return ApiService.getAPI(ProjectsService.projectsUrl + "/" + projectID) 
        .then((response) => {
            return ProjectList.map(response.data);
        })
    }

    public static changeProjectSettings(projectID: number, projectName: string, projectColor: string, projectDescription: string): Promise<ProjectList> {
        const bodyParameters = {
            name: projectName,
            color: projectColor,
            description: projectDescription
        };
        return ApiService.putAPI(ProjectsService.projectsUrl + "/" + projectID, bodyParameters)
        .then((response) => {
            return ProjectList.map(response.data);
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