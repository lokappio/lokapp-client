import config from "@/config";
import {AxiosResponse} from "axios";
import ApiService from "./ApiService";
import Key from "@/data/models/api/Key";
import Value, {ValueQuantity} from "@/data/models/api/Value";
import Language from "@/data/models/api/Language";
import store from "@/store/index";

class ValuesService {
    static valuesUrl: string = config.baseUrl + "/projects/";
    static get languages(): Language[] { return store.getters.currentProject.languages}
    static get projectId(): number { return store.getters.currentProject.id}


    public static async createValue(keyId: number, value: Value): Promise<Value> {
        const bodyParameters = {
            name: value.name,
            languageId: value.languageId,
            quantityString: value.quantityString
        };

        const result: AxiosResponse = await ApiService.postAPI(ValuesService.valuesUrl + this.projectId + "/translations/" + keyId + "/values", bodyParameters)
        return Value.map(result.data);
    }

    public static retrieveValueForKey(key: Key, languages: Language[] = this.languages): Value[] {
        const result = languages.map((language) => {
            if (key.isPlural) {
                 const values: Value[] = Object.values(ValueQuantity).map((quantity) => {
                     return Value.map({
                        name: "",
                        languageId: language.id,
                        quantityString: quantity,
                    });
                });

                return values.flat(2);
            } else {
                return Value.map({
                    name: "",
                    languageId: language.id,
                    quantityString: null,
                });
            }
        });

        return result.flat();
    }

    public static updateValue(value: Value): Promise<AxiosResponse> {
        const bodyParameters = {
            name: value.name
        };
        return ApiService.patchAPI(ValuesService.valuesUrl + this.projectId + "/translations/" + value.keyId + "/values/" + value.id, bodyParameters);
    }

    public static getValuesByKeyId(keyId: number, projectId = this.projectId): Promise<Value[]> {
        return ApiService.getAPI(ValuesService.valuesUrl + projectId + "/translations/" + keyId + "/values")
        .then((response) => response.data.map((item: any) => Value.map(item)));
    }

    public static getValuesByLanguageId(languageId: number, projectId = this.projectId): Promise<Value[]> {
        //TODO: correct api route
        return ApiService.getAPI(ValuesService.valuesUrl + projectId + "/translations/" + languageId + "/values")
        .then((response) => response.data.map((item: any) => Value.map(item)));
    }
}

export default ValuesService;