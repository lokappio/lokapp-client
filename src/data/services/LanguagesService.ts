import config from "@/config";
import Language from "../models/api/Language";
import ApiService from "./ApiService";
import store from "@/store/index";
import Value from "@/data/models/api/Value";

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
        const language = Language.map(result.data.language);
        const values = result.data.values.map((value: {}) => Value.map(value));

        return {language: language, values: values};
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

  public static deleteLanguage(languageId: number, projectId = this.projectId): Promise<any> {
    return ApiService.delAPI(LanguagesService.languagesUrl + projectId + "/languages/" + languageId).catch((error) => {
      if (error.response) {
        switch (error.response.status) {
          case 403:
            throw "errors.unauthorized";
          default:
            throw "error.unknown_error";
        }
      }
    });
  }
}

export default LanguagesService;