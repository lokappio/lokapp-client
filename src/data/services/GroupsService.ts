import config from "@/config";
import { AxiosResponse } from "axios";
import Group from "../models/api/Group";
import ApiService from "./ApiService";

class GroupsService {
    static groupsUrl: string = config.baseUrl + "/projects/";

    public static getGroups(projectId: number): Promise<Array<Group>> {
        return ApiService.getAPI(GroupsService.groupsUrl + projectId + "/groups")
        .then((response) => {
            return response.data.map((item: any) => {
                return Group.map(item);
            })
        })
    }

    public static createGroup(projectId: number, groupName: string): Promise<AxiosResponse<any>> {
        const bodyParameters = {
            name: groupName
        };
        return ApiService.postAPI(GroupsService.groupsUrl + projectId + "/groups", bodyParameters);
    }

    public static updateGroup(projectId: number, groupId: number, groupName: string): Promise<AxiosResponse<any>> {
        const bodyParameters = {
            name: groupName
        };
        return ApiService.patchAPI(GroupsService.groupsUrl + projectId + "/groups/" + groupId, bodyParameters);
    }
}

export default GroupsService;