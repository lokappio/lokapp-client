import {FileData} from "@/data/models/types/export";
import Project from "@/data/models/api/Project";
import {jsonTranslationFromXMLFiles} from "@/data/services/imports/import_android_xml";
import ImportItem from "@/data/models/ImportItem";

export default class ImportService {
  public static async importFromFiles(project: Project, items: ImportItem[]): Promise<Project> {
    switch (items[0].extension) {
      case "json":
        return null;
      case "xml":
        return await jsonTranslationFromXMLFiles(project, items);
    }
  }
}

