import Project from "@/data/models/api/Project";
import ImportItem from "@/data/models/ImportItem";
import { Platform } from "@/data/models/enums/project";

import { checkAllValuesCreatedAndAdd } from "./imports/import_configuration";
import { importIOSStrings } from "./imports/import_ios_strings";
import { importAndroidXml } from "./imports/import_android_xml";
import { importWebJson } from "./imports/import_web_json";

export default class ImportService {
  public static async importFromFiles(project: Project, items: ImportItem[], platform: Platform): Promise<Project> {
    let res = project;
    for (const item of items) {
      switch (platform) {
        case Platform.WEB:
          res = await importWebJson(res, item);
          break;
          case Platform.ANDROID:
          res = await importAndroidXml(res, item);
          break;
        case Platform.IOS:
          res = await importIOSStrings(res, item);
          break;
      }
    }

    if (res !== null) {
      checkAllValuesCreatedAndAdd(res);
    }

    return res;
  }
}

