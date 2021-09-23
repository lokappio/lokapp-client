import config from "@/config";
import { AxiosResponse } from "axios";
import Language from "../models/api/Language";
import ApiService from "./ApiService";


class LanguagesService {
    static languagesUrl: string = config.baseUrl + "/projects/";

    public static getLanguages(projectId: number): Promise<Array<Language>> {
        return ApiService.getAPI(LanguagesService.languagesUrl + projectId + "/languages")
        .then((response) => {
            return response.data.map((item: any) => {
                return Language.map(item);
            });
        })
    }

    public static createLanguage(projectId: number, languageName: string): Promise<AxiosResponse<any>> {
        const bodyParameters = {
            name: languageName
        };
        return ApiService.postAPI(LanguagesService.languagesUrl + projectId + "/languages", bodyParameters)
    }

    public static getLanguage(projectId: number, languageId: number): Promise<Language> {
        return ApiService.getAPI(LanguagesService.languagesUrl + projectId + "/languages/" + languageId)
        .then((response) => {
            return Language.map(response.data);
        });
    }

    public static deleteLanguage(projectId: number, languageId: number): Promise<AxiosResponse<any>> {
        return ApiService.delAPI(LanguagesService.languagesUrl + projectId + "/languages/" + languageId);
    }
}

export default LanguagesService;