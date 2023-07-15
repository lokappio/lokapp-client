import config from "@/config";
import { AxiosResponse } from "axios";
import ApiService from "./ApiService";
import Key from "@/data/models/api/Key";
import Group from "@/data/models/api/Group";
import GroupsService from "@/data/services/GroupsService";
import ValuesService from "@/data/services/ValuesService";
import store from "@/store/index";
import Value from "@/data/models/api/Value";

export interface KeyValues {
  key: Key;
  group: Group;
  values: Value[];
}

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

  public static async createKeys(keyValues: KeyValues[], projectId: number = this.projectId): Promise<Key[]> {
    const bodyParameters = keyValues.map((keyValue: KeyValues) => ({
      name: keyValue.key.name,
      groupId: keyValue.group.isNewGroup ? null : keyValue.group.id,
      groupName: keyValue.group.name,
      isPlural: keyValue.key.isPlural,
      values: keyValue.values.map((value: Value) => {
        return {
          name: value.name,
          languageId: value.languageId,
          quantityString: value.quantityString
        }
      })
    }));

    bodyParameters.forEach((bodyParameter: any) => {
      if (bodyParameter.values.length === 0) {
        delete bodyParameter.values;
      }
    });

    const result: AxiosResponse = await ApiService.postAPI(KeysService.keysUrl + projectId + "/translations/keys", bodyParameters);
    return result.data.map(Key.map);
  }

  public static async createKey(key: Key, group: Group, projectId: number = this.projectId, values: Value[] = []): Promise<Key> {
    const bodyParameters = {
      name: key.name,
      groupId: group.isNewGroup ? null : group.id,
      groupName: group.name,
      isPlural: key.isPlural,
      values: values.map((value: Value) => {
        return {
          name: value.name,
          languageId: value.languageId,
          quantityString: value.quantityString
        }
      })
    };

    if (bodyParameters.values.length === 0) {
      delete bodyParameters.values;
    }

    const result: AxiosResponse = await ApiService.postAPI(KeysService.keysUrl + projectId + "/translations", bodyParameters);
    return Key.map(result.data);
  }

  public static async createKeyWithGroup(group: Group, key: Key): Promise<{ group: Group | null; key: Key }> {
    const data: { group: Group | null; key: Key } = {} as any;

    try {
      const createdKey: Key = await this.createKey(key, group);
      createdKey.values = await ValuesService.getValuesByKeyId(createdKey.id);

      if (group.isNewGroup) {
        data.group = await GroupsService.getGroupById(createdKey.groupId);
      }
      data.key = createdKey;
    } catch (error: any) {
      console.error(error);

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
        console.error(error);

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
      console.error(error);

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
