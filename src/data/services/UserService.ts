import ApiService from "./ApiService";
import User from "../models/api/User";
import config from "@/config";
import ProjectUser from "@/data/models/api/ProjectUser";

class UserService {
    static userUrl: string = config.baseUrl + "/users";

    public static getMe(): Promise<ProjectUser> {
        return ApiService.getAPI(UserService.userUrl + "/me") 
        .then((response) => {
            return ProjectUser.map(response.data);
        })
    }

    public static updateProfile(username: string): Promise<ProjectUser> {
        const bodyParameters = {
            username: username,
        };

        return ApiService.patchAPI(UserService.userUrl + "/me", bodyParameters)
        .then((response) => {
            return ProjectUser.map(response.data);
        })
    }

    public static async getMyselfInProject(projectId: number): Promise<ProjectUser> {
        return ApiService.getAPI(config.baseUrl + "/projects/" + projectId + "/users/me").then((result) => {
            return ProjectUser.map(result.data);
        })

    }
}

export default UserService;