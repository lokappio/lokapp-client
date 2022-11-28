import Project from "@/data/models/api/Project";
import ImportItem from "@/data/models/ImportItem";
import { Platform } from "@/data/models/enums/project";

import { projectTranslationFromXMLFiles } from "@/data/services/imports/import_android_xml";
import { projectTranslationFromJSONFiles } from "@/data/services/imports/import_web_json";
import { projectTranslationFromStringsFiles } from "@/data/services/imports/import_ios_strings";
import { checkAllValuesCreatedAndAdd } from "./imports/import_configuration";

export default class ImportService {
  public static async importFromFiles(project: Project, items: ImportItem[], platform: Platform): Promise<Project> {
    let res = null;

    switch (platform) {
      case Platform.WEB:
        res = await projectTranslationFromJSONFiles(project, items);
        break;
      case Platform.ANDROID:
        res = await projectTranslationFromXMLFiles(project, items);
        break;
      case Platform.IOS:
        res = await projectTranslationFromStringsFiles(project, items);
        break;
    }

    if (res !== null) {
      checkAllValuesCreatedAndAdd(res);
    }

    return res;
  }
}

