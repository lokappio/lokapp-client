import config from "@/config";
import { AxiosResponse } from "axios";
import ApiService from "./ApiService";
import Key from "@/data/models/api/Key";
import Value, {ValueQuantity} from "@/data/models/api/Value";
import Language from "@/data/models/api/Language";
import store from '@/store/index';

class ValuesService {
    static valuesUrl: string = config.baseUrl + "/projects/";
    static get languages(): Language[] { return store.getters.currentProject.languages}
    static get projectId(): number { return store.getters.currentProject.id}


    public static async createValue(keyId: number, value: Value): Promise<Value> {
        const bodyParameters = {
            name: value.name,
            "language_id": value.languageId,
            "quantity_string": value.quantityString
        };

        const result: AxiosResponse = await ApiService.postAPI(ValuesService.valuesUrl + this.projectId + "/translations/" + keyId + "/values", bodyParameters)
        return Value.map(result.data);
    }

    public static async createValueForKey(key: Key, languages: Language[] = this.languages): Promise<Value[]> {
        const result: Value[] = await Promise.all(languages.map(async (language) => {
            if (key.isPlural) {
                return await Promise.all(Object.values(ValueQuantity).map(async (quantity) => {
                    const value = Value.map({name: "", 'language_id': language.id, 'quantity_string': quantity})
                    return await this.createValue(key.id, value);
                }));
            } else {
                const value = Value.map({name: "", 'language_id': language.id, quantityString: null})
                return await this.createValue(key.id, value);
            }
        }).flat());

        return result;
    }

    public static updateValue(value: Value): Promise<AxiosResponse> {
        const bodyParameters = {
            name: value.name
        };
        return ApiService.patchAPI(ValuesService.valuesUrl + this.projectId + "/translations/" + value.keyId + "/values/" + value.id, bodyParameters);
    }

    public static getValuesByKeyId(keyId: number, projectId = this.projectId): Promise<Value[]> {
        return ApiService.getAPI(ValuesService.valuesUrl + projectId + "/translations/" + keyId + "/values")
        .then((response) => {
            return response.data.map((item: any) => Value.map(item));
        })
    }
}

export default ValuesService;