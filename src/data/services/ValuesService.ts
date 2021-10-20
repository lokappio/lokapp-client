import config from "@/config";
import { AxiosResponse } from "axios";
import Value from "../models/api/Value";
import ApiService from "./ApiService";
import NewKey from "@/data/models/api/NewKey";
import NewValue, {ValueQuantity} from "@/data/models/api/NewValue";
import Language from "@/data/models/api/Language";
import store from '@/store/index';

class ValuesService {
    static valuesUrl: string = config.baseUrl + "/projects/";
    static get languages(): Language[] { return store.getters.currentProject.languages}
    static get projectId(): number { return store.getters.actualProjectId}

    public static getEveryValues(): Promise<Array<Value>> {
        return ApiService.getAPI(ValuesService.valuesUrl + this.projectId + "/translations/all")
        .then((response) => {
            return response.data.map((item: any) => {
                return Value.map(item);
            })
        })
    }

    public static async  createValue(keyId: number, value: NewValue): Promise<NewValue> {
        const bodyParameters = {
            name: value.name,
            "language_id": value.languageId,
            "quantity_string": value.quantityString
        };

        const result: AxiosResponse = await ApiService.postAPI(ValuesService.valuesUrl + this.projectId + "/translations/" + keyId + "/values", bodyParameters)
        return NewValue.map(result.data);
    }

    public static async createValueForKey(key: NewKey): Promise<NewValue[]> {
        const result = await Promise.all(this.languages.map(async (language) => {
            if (key.isPlural) {
                return await Promise.all(Object.values(ValueQuantity).map(async (quantity) => {
                    const value = NewValue.map({name: "", 'language_id': language.id, 'quantity_string': quantity})
                    return await this.createValue(key.id, value);
                }));
            } else {
                const value = NewValue.map({name: "", 'language_id': language.id, quantityString: null})
                return await this.createValue(key.id, value);
            }
        }));

        console.log(result.flat());
        return result.flat();
    }

    public static updateValue(value: NewValue): Promise<AxiosResponse> {
        const bodyParameters = {
            name: value.name
        };
        return ApiService.patchAPI(ValuesService.valuesUrl + this.projectId + "/translations/" + value.keyId + "/values/" + value.id, bodyParameters);
    }

    public static deleteValue(valueTarget: Value): Promise<AxiosResponse<any>> {
        return ApiService.delAPI(ValuesService.valuesUrl + this.projectId + "/translations/" + valueTarget.keyId + "/values/" + valueTarget.valueId);
    }

    public static getValuesByKeyId(keyId: number): Promise<NewValue[]> {
        return ApiService.getAPI(ValuesService.valuesUrl + this.projectId + "/translations/" + keyId + "/values")
        .then((response) => {
            return response.data.map((item: any) => {
                return NewValue.map(item);
            });
        })
    }
}

export default ValuesService;