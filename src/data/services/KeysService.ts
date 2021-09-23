import config from "@/config";
import { AxiosResponse } from "axios";
import Key from "../models/api/Key";
import ApiService from "./ApiService";

class KeysService {
    static keysUrl: string = config.baseUrl + "/projects/";

    public static getKeys(projectId: number): Promise<Array<Key>> {
        return ApiService.getAPI(KeysService.keysUrl + projectId + "/translations")
        .then((response) => {
            return response.data.map((item: any) => {
                return Key.map(item);
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

    public static updateKey(projectId: number, keyId: number, newName: string): Promise<AxiosResponse<any>> {
        const bodyParameters = {
            name: newName
        };
        return ApiService.patchAPI(KeysService.keysUrl + projectId + "/translations/" + keyId, bodyParameters);
    }

    public static updateKeyPlural(projectId: number, keyId: number, isPlural: boolean): Promise<AxiosResponse<any>> {
        const bodyParameters = {
            "is_plural": isPlural
        };
        return ApiService.patchAPI(KeysService.keysUrl + projectId + "/translations/" + keyId, bodyParameters);
    }
}

export default KeysService;