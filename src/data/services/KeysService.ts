import config from "@/config";
import {AxiosResponse} from "axios";
import ApiService from "./ApiService";
import Key from "@/data/models/api/Key";
import Group from "@/data/models/api/Group";
import GroupsService from "@/data/services/GroupsService";
import ValuesService from "@/data/services/ValuesService";
import store from "@/store/index";

class KeysService {
  static keysUrl: string = config.baseUrl + "/projects/";

  static get projectId(): number {
    return store.getters.currentProject.id;
  }

  public static getKeys(projectId = this.projectId): Promise<Array<Key>> {
    return ApiService.getAPI(KeysService.keysUrl + projectId + "/translations")
      .then((response) => {
        return response.data.map((item: any) => {
          return Key.map(item);
        });
      });
  }

  public static async createKey(key: Key, group: Group): Promise<Key> {
    const bodyParameters = {
      name: key.name,
      groupId: group.id,
      groupName: group.name,
      isPlural: key.isPlural
    };

    const result: AxiosResponse = await ApiService.postAPI(KeysService.keysUrl + this.projectId + "/translations/", bodyParameters);
    return Key.map(result.data);
  }

  public static async createKeyWithGroup(group: Group, key: Key): Promise<{ group: Group | null; key: Key }> {
    const data: { group: Group | null; key: Key } = {} as any;

    try {
      const createdKey: Key = await this.createKey(key, group);

      //ASSIGN EMPTY VALUES FOR EACH LANGUAGES AND EACH QUANTITIES
      createdKey.values = ValuesService.retrieveValueForKey(createdKey);

      if (group.isNewGroup) {
        data.group = await GroupsService.getGroupById(createdKey.groupId);
      }
      data.key = createdKey;
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 422:
            throw "errors.key_name_already_exists";
          case 403:
            throw "errors.unauthorized";
          default:
            throw "errors.unknown_error";
        }
      }
    }

    return data;
  }

  public static deleteKey(keyId: number): Promise<any> {
    return ApiService.delAPI(KeysService.keysUrl + this.projectId + "/translations/" + keyId)
      .catch((error) => {
        if (error.response) {
          switch (error.response.status) {
            case 404:
              throw "errors.not_existing_key";
            case 403:
              throw "errors.unauthorized";
            default:
              throw "errors.unknown_error";
          }
        }
      });
  }

  public static async updateKey(key: Key): Promise<Key> {
    const bodyParameters = {
      name: key.name,
      isPlural: key.isPlural
    };

    return ApiService.patchAPI(KeysService.keysUrl + this.projectId + "/translations/" + key.id, bodyParameters).then(async () => {
      key.values = await ValuesService.getValuesByKeyId(key.id);
      return key;
    }).catch((error) => {
      switch (error.response.status) {
        case 422:
          throw "errors.key_name_already_exists";
        case 403:
          throw "errors.unauthorized";
        case 404:
          throw "errors.not_existing_key";
        default:
          throw "errors.unknown_error";
      }
    });
  }
}

export default KeysService;