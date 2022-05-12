import config from "@/config";
import { AxiosResponse } from "axios";
import ApiService from "./ApiService";
import Group from "@/data/models/api/Group";
import store from '@/store/index';
import Project from "@/data/models/api/Project";

class GroupsService {
    static groupsUrl: string = config.baseUrl + "/projects/";
    static get projectId(): number { return store.getters.currentProject.id}

    public static getGroups(projectId = this.projectId): Promise<Array<Group>> {
        return ApiService.getAPI(GroupsService.groupsUrl + projectId + "/groups")
        .then((response) => {
            return response.data.map((item: any) => {
                return Group.map(item);
            })
        })
    }

    public static getGroupById(groupId: number, projectId = this.projectId): Promise<Group> {
        return ApiService.getAPI(`${GroupsService.groupsUrl}${projectId}/groups/${groupId}`)
        .then((response) => Group.map(response.data));
    }

    public static async createGroup(group: Group, projectId: number = this.projectId): Promise<Group> {
        const bodyParameters = {
            name: group.name
        };

        const result: AxiosResponse = await ApiService.postAPI(GroupsService.groupsUrl + projectId + "/groups", bodyParameters);
        return Group.map(result.data);
    }

    public static updateGroup(groupId: number, groupName: string): Promise<any> {
        const bodyParameters = {
            name: groupName
        };

        return ApiService.patchAPI(GroupsService.groupsUrl + this.projectId + "/groups/" + groupId, bodyParameters)
          .catch((error) => {
              if (error.response) {
                  switch (error.response.status) {
                      case 422:
                          throw "errors.group_already_exists";
                      case 404:
                          throw "errors.not_existing_group";
                      case 403:
                          throw "errors.unauthorized";
                      default:
                          throw "errors.unknown-error";
                  }
              }
        });
    }
}

export default GroupsService;