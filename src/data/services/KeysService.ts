import config from "@/config";
import { AxiosResponse } from "axios";
import ApiService from "./ApiService";
import NewKey from "@/data/models/api/NewKey";
import NewGroup from "@/data/models/api/NewGroup";
import GroupsService from "@/data/services/GroupsService";
import ValuesService from "@/data/services/ValuesService";
import store from '@/store/index';

class KeysService {
    static keysUrl: string = config.baseUrl + "/projects/";
    static get projectId(): number { return store.getters.actualProjectId}

    public static getKeys(): Promise<Array<NewKey>> {
        return ApiService.getAPI(KeysService.keysUrl + this.projectId + "/translations")
        .then((response) => {
            return response.data.map((item: any) => {
                return NewKey.map(item);
            })
        })
    }

    public static async createKey(key: NewKey): Promise<NewKey> {
        const bodyParameters = {
            name: key.name,
            "group_id": key.groupId,
            "is_plural": key.isPlural
        };

        const result: AxiosResponse = await ApiService.postAPI(KeysService.keysUrl + this.projectId + "/translations/", bodyParameters);
        return NewKey.map(result.data);
    }

    public static async createKeyWithGroup(createGroup: boolean, group: NewGroup, key: NewKey): Promise<NewKey> {
        //IF GROUP DOESN'T EXIST YET IN DB, CREATE IT ...
        if (createGroup) {
            try {
                const result: NewGroup = await GroupsService.createGroup(group)
                key.groupId = result.id;
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

        let createdKey: NewKey;
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

        return createdKey;
    }

    public static deleteKey(keyId: number): Promise<AxiosResponse> {
        return ApiService.delAPI(KeysService.keysUrl + this.projectId + "/translations/" + keyId);
    }

    public static updateKey(key: NewKey): Promise<AxiosResponse> {
        const bodyParameters = {
            name: key.name,
            "is_plural": key.isPlural
        };
        return ApiService.patchAPI(KeysService.keysUrl + this.projectId + "/translations/" + key.id, bodyParameters);
    }
}

export default KeysService;