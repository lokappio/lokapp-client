import config from "@/config";
import {AxiosResponse} from "axios";
import Language from "../models/api/Language";
import ApiService from "./ApiService";
import store from "@/store/index";
import ValuesService from "@/data/services/ValuesService";
import Key from "@/data/models/api/Key";
import Value from "@/data/models/api/Value";
import Project from "@/data/models/api/Project";

class LanguagesService {
  static languagesUrl: string = config.baseUrl + "/projects/";

  static get projectId(): number {
    return store.getters.currentProject.id;
  }

  public static getLanguages(projectId = this.projectId): Promise<Array<Language>> {
    return ApiService.getAPI(LanguagesService.languagesUrl + projectId + "/languages")
      .then((response) => {
        return response.data.map((item: any) => Language.map(item));
      });
  }

  public static createLanguage(languageName: string): Promise<{ language: Language; values: Value[] } | void> {
    const bodyParameters = {name: languageName};

    return ApiService.postAPI(LanguagesService.languagesUrl + this.projectId + "/languages", bodyParameters)
      .then(async (result) => {
        const language = Language.map(result.data);

        //INSERT EACH VALUES IN DB FOR THE NEWLY CREATED LANGUAGE
        const keys: Key[] = (store.getters.currentProject as Project).groups.map(group => group.keys).flat();
        const values = await Promise.all(keys.map(async (key) => await ValuesService.createValueForKey(key, [language])));

        return {language: language, values: values.flat()};
      })
      .catch((error) => {
        if (error.response) {
          switch (error.response.status) {
            case 403:
              throw "errors.unauthorized";
            case 422:
              throw "errors.language_already_exists";
          }
        }
      });
  }

  public static getLanguage(languageId: number): Promise<Language> {
    return ApiService.getAPI(LanguagesService.languagesUrl + this.projectId + "/languages/" + languageId)
      .then((response) => {
        return Language.map(response.data);
      });
  }

  public static deleteLanguage(languageId: number, projectId = this.projectId): Promise<AxiosResponse> {
    return ApiService.delAPI(LanguagesService.languagesUrl + projectId + "/languages/" + languageId);
  }
}

export default LanguagesService;