import config from "@/config";
import { AxiosResponse } from "axios";
import ApiService from "./ApiService";
import Key from "@/data/models/api/Key";
import Group from "@/data/models/api/Group";
import GroupsService from "@/data/services/GroupsService";
import ValuesService from "@/data/services/ValuesService";
import store from '@/store/index';

class KeysService {
    static keysUrl: string = config.baseUrl + "/projects/";
    static get projectId(): number { return store.getters.currentProject.id}

    public static getKeys(projectId = this.projectId): Promise<Array<Key>> {
        return ApiService.getAPI(KeysService.keysUrl + projectId + "/translations")
        .then((response) => {
            return response.data.map((item: any) => {
                return Key.map(item);
            })
        })
    }

    public static async createKey(key: Key): Promise<Key> {
        const bodyParameters = {
            name: key.name,
            "group_id": key.groupId,
            "is_plural": key.isPlural
        };

        const result: AxiosResponse = await ApiService.postAPI(KeysService.keysUrl + this.projectId + "/translations/", bodyParameters);
        return Key.map(result.data);
    }

    public static async createKeyWithGroup(createGroup: boolean, group: Group, key: Key): Promise<{group: Group | null; key: Key}> {
        /*TODO: REMOVE FROM FRONT AND MOVE TO API */
        const data: {group: Group | null; key: Key} = {} as any;

        //IF GROUP DOESN'T EXIST YET IN DB, CREATE IT ...
        if (createGroup) {
            try {
                const result: Group = await GroupsService.createGroup(group);
                key.groupId = result.id;
                data.group = result;
            } catch(error) {
                if (error.response) {
                    switch (error.response.status) {
                        case 422:
                            throw "errors.group_already_exists";
                        case 403:
                            throw "errors.unauthorized";
                        case 404:
                            throw "errors.group_create_failed";
                        default:
                            throw "errors.unknown_error";
                    }
                }
            }
        } else {
            key.groupId = group.id;
        }


        let createdKey: Key;
        //CREATE KEY WITH CURRGROUP
        try {
            createdKey = await this.createKey(key);
        } catch(error) {
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

        //FINALLY, CREATE EMPTY VALUES FOR EACH LANGUAGES AND EACH QUANTITIES
        try{
            const result = await ValuesService.createValueForKey(createdKey);
            createdKey.values = result;
        } catch(e) {
            throw "errors.unknown_error";
        }

        data.key = createdKey
        return data;
    }

    public static deleteKey(keyId: number): Promise<AxiosResponse> {
        return ApiService.delAPI(KeysService.keysUrl + this.projectId + "/translations/" + keyId);
    }

    public static updateKey(key: Key): Promise<AxiosResponse> {
        const bodyParameters = {
            name: key.name,
            "is_plural": key.isPlural
        };

        return ApiService.patchAPI(KeysService.keysUrl + this.projectId + "/translations/" + key.id, bodyParameters);
    }
}

export default KeysService;