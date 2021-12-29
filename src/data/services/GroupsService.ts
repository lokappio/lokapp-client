import config from "@/config";
import { AxiosResponse } from "axios";
import ApiService from "./ApiService";
import Group from "@/data/models/api/Group";
import store from '@/store/index';

class GroupsService {
    static groupsUrl: string = config.baseUrl + "/projects/";
    static get projectId(): number { return store.getters.currentProject.id}

    public static getGroups(): Promise<Array<Group>> {
        return ApiService.getAPI(GroupsService.groupsUrl + this.projectId + "/groups")
        .then((response) => {
            return response.data.map((item: any) => {
                return Group.map(item);
            })
        })
    }

    public static async createGroup(group: Group): Promise<Group> {
        const bodyParameters = {
            name: group.name
        };

        const result: AxiosResponse = await ApiService.postAPI(GroupsService.groupsUrl + this.projectId + "/groups", bodyParameters);
        return Group.map(result.data);
    }

    public static updateGroup(groupId: number, groupName: string): Promise<AxiosResponse<any>> {
        const bodyParameters = {
            name: groupName
        };
        return ApiService.patchAPI(GroupsService.groupsUrl + this.projectId + "/groups/" + groupId, bodyParameters);
    }
}

export default GroupsService;