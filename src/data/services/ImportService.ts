import Project from "@/data/models/api/Project";
import ImportItem from "@/data/models/ImportItem";
import { Platform } from "@/data/models/enums/project";

import { projectTranslationFromXMLFiles } from "@/data/services/imports/import_android_xml";
import { projectTranslationFromJSONFiles } from "@/data/services/imports/import_web_json";
import { projectTranslationFromStringsFiles } from "@/data/services/imports/import_ios_strings";

export default class ImportService {
  public static async importFromFiles(project: Project, items: ImportItem[], platform: Platform, fromExistingProject = false): Promise<Project> {
    switch (platform) {
      case Platform.WEB:
        return await projectTranslationFromJSONFiles(project, items, fromExistingProject);
      case Platform.ANDROID:
        return await projectTranslationFromXMLFiles(project, items, fromExistingProject);
      case Platform.IOS:
        return await projectTranslationFromStringsFiles(project, items, fromExistingProject);
      default:
        return null;
    }
  }
}

