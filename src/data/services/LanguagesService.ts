import config from "@/config";
import { AxiosResponse } from "axios";
import Language from "../models/api/Language";
import ApiService from "./ApiService";
import store from "@/store/index";
import ValuesService from "@/data/services/ValuesService";
import Key from "@/data/models/api/Key";

class LanguagesService {
    static languagesUrl: string = config.baseUrl + "/projects/";
    static get projectId(): number { return store.getters.currentProject.id}

    public static getLanguages(projectId = this.projectId): Promise<Array<Language>> {
        return ApiService.getAPI(LanguagesService.languagesUrl + projectId + "/languages")
        .then((response) => {
            return response.data.map((item: any) => Language.map(item));
        })
    }

    public static createLanguage(languageName: string): Promise<any> {
        const bodyParameters = {
            name: languageName
        };

        return ApiService.postAPI(LanguagesService.languagesUrl + this.projectId + "/languages", bodyParameters)
          .then(async (result) => {
              /*TODO: REMOVE FROM FRONT AND MOVE TO API */
              const language = Language.map(result.data);

              const keys: Key[] = store.getters.currentProject.groups.map((group) => group.keys).flat();

              return Promise.all(keys.map(async (key) => await ValuesService.createValueForKey(key, [language])));
        });
    }

    public static getLanguage(languageId: number): Promise<Language> {
        return ApiService.getAPI(LanguagesService.languagesUrl + this.projectId + "/languages/" + languageId)
        .then((response) => {
            return Language.map(response.data);
        });
    }

    public static deleteLanguage(languageId: number, projectId = this.projectId): Promise<AxiosResponse<any>> {
        return ApiService.delAPI(LanguagesService.languagesUrl + projectId + "/languages/" + languageId);
    }
}

export default LanguagesService;