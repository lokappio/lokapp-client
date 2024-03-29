import config from "@/config";
import Project from "@/data/models/api/Project";
import Value from "@/data/models/api/Value";
import { Platform } from "@/data/models/enums/project";
import ImportItem from "@/data/models/ImportItem";
import ImportService from "@/data/services/ImportService";
import projectsService from "@/data/services/ProjectsService";
import ValuesService from "@/data/services/ValuesService";
import store from "@/store/index";
import Language from "../models/api/Language";
import ApiService from "./ApiService";
import Group from "@/data/models/api/Group";

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

  public static async createLanguageFromImport(project: Project, item: ImportItem, platform: Platform, replaceExistingKeys?: boolean) {
    const projectFromStore = Object.assign(Project.map({}), JSON.parse(JSON.stringify(project)));
    projectFromStore.languages.push(Language.map({name: item.language}));

    const projectImport = await ImportService.generateProjectFromFiles(projectFromStore, [item], platform);

    const groups: Group[] = projectImport.groups
    await this.createLanguage(item.language, groups, replaceExistingKeys);

    return await projectsService.getEntireProjectById(projectImport.id);
  }

  public static createLanguage(languageName: string, groups?: Group[], replaceExistingKeys?: boolean): Promise<{ language: Language; values: Value[] } | void> {
    const bodyParameters = {
      name: languageName,
      groups: groups,
      replaceExistingKeys: replaceExistingKeys || false
    };

    return ApiService.postAPI(LanguagesService.languagesUrl + this.projectId + "/languages", bodyParameters)
      .then(async (result) => {
        const language = Language.map(result.data);
        const values = await ValuesService.getValuesByLanguageId(language.id);

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
