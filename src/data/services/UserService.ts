import ApiService from "./ApiService";
import UserInfo from "../models/api/UserInfo";
import config from "@/config";

class UserService {
    static userUrl: string = config.baseUrl + "/users";

    public static getMe(): Promise<UserInfo> {
        return ApiService.getAPI(UserService.userUrl + "/me") 
        .then((response) => {
            return UserInfo.map(response.data);
        })
    }

    public static updateProfile(username: string): Promise<UserInfo> {
        const bodyParameters = {
            username: username,
        };
        return ApiService.patchAPI(UserService.userUrl + "/me", bodyParameters)
        .then((response) => {
            return UserInfo.map(response.data);
        })
    }

    public static getMyselfInProject(projectId: number): Promise<any> {
        return ApiService.getAPI(config.baseUrl + "/projects/" + projectId + "/users/me");
    }
}

export default UserService;