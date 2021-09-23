import config from "@/config";
import { AxiosResponse } from "axios";
import SpecificValue from "../models/api/SpecificValue";
import Value from "../models/api/Value";
import ApiService from "./ApiService";

class ValuesService {
    static valuesUrl: string = config.baseUrl + "/projects/";

    public static getEveryValues(projectId: number): Promise<Array<Value>> {
        return ApiService.getAPI(ValuesService.valuesUrl + projectId + "/translations/all")
        .then((response) => {
            return response.data.map((item: any) => {
                return Value.map(item);
            })
        })
    }

    public static createValue(projectId: number, keyId: number, value: Value): Promise<AxiosResponse<any>> {
        const bodyParameters = {
            name: value.valueName,
            "language_id": value.languageId,
            "quantity_string": value.quantity
        };
        return ApiService.postAPI(ValuesService.valuesUrl + projectId + "/translations/" + keyId + "/values", bodyParameters);
    }

    public static getSpecificValue(projectId: number, valueTarget: Value): Promise<Array<SpecificValue>> {
        return ApiService.getAPI(ValuesService.valuesUrl + projectId + "/translations/" + valueTarget.keyId + "/values?language_id=" + valueTarget.languageId)
        .then((response) => {
            return response.data.map((item: any) => {
                return SpecificValue.map(item);
            });
        })
    }

    public static updateValue(projectId: number, valueTarget: Value): Promise<AxiosResponse<any>> {
        const bodyParameters = {
            name: valueTarget.valueName
        };
        return ApiService.patchAPI(ValuesService.valuesUrl + projectId + "/translations/" + valueTarget.keyId + "/values/" + valueTarget.valueId, bodyParameters);
    }

    public static deleteValue(projectId: number, valueTarget: Value): Promise<AxiosResponse<any>> {
        return ApiService.delAPI(ValuesService.valuesUrl + projectId + "/translations/" + valueTarget.keyId + "/values/" + valueTarget.valueId);
    }

    public static getValuesForKey(projectId: number, keyId: number): Promise<Array<SpecificValue>> {
        return ApiService.getAPI(ValuesService.valuesUrl + projectId + "/translations/" + keyId + "/values")
        .then((response) => {
            return response.data.map((item: any) => {
                return SpecificValue.map(item);
            });
        })
    }
}

export default ValuesService;