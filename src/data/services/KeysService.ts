import config from "@/config";
import { AxiosResponse } from "axios";
import ApiService from "./ApiService";
import NewKey from "@/data/models/api/NewKey";

class KeysService {
    static keysUrl: string = config.baseUrl + "/projects/";

    public static getKeys(projectId: number): Promise<Array<NewKey>> {
        return ApiService.getAPI(KeysService.keysUrl + projectId + "/translations")
        .then((response) => {
            return response.data.map((item: any) => {
                return NewKey.map(item);
            })
        })
    }

    public static createKey(projectId: number, keyName: string, groupId: any, isPlural: boolean): Promise<AxiosResponse<any>> {
        const bodyParameters = {
            name: keyName,
            "group_id": groupId,
            "is_plural": isPlural
        };
        return ApiService.postAPI(KeysService.keysUrl + projectId + "/translations/", bodyParameters);
    }

    public static deleteKey(projectId: number, keyId: number): Promise<AxiosResponse<any>> {
        return ApiService.delAPI(KeysService.keysUrl + projectId + "/translations/" + keyId);
    }

    public static updateKey(projectId: number, key: NewKey/*keyId: number, newName: string*/): Promise<AxiosResponse> {
        const bodyParameters = {
            name: key.name,
            "is_plural": key.isPlural
        };
        return ApiService.patchAPI(KeysService.keysUrl + projectId + "/translations/" + key.id, bodyParameters);
    }
}

export default KeysService;