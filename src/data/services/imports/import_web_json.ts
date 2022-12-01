import Project from "@/data/models/api/Project";
import ImportItem from "@/data/models/ImportItem";
import {DEFAULT_GROUP_NAME} from "@/data/helpers/constants";
import i18n from "@/i18n";
import ImportError from "@/data/models/ImportError";
import { insertValuesToProject, KeyGroups } from "./utils";
import Key from "@/data/models/api/Key";
import Value from "@/data/models/api/Value";

const jsonTranslationFromJSON = (data: string, project: Project, item: ImportItem): Project => {
  const groups: KeyGroups = {};
  groups[DEFAULT_GROUP_NAME] = groups[DEFAULT_GROUP_NAME] || [];

  let jsonData: Record<string, any>;
  try {
    jsonData = JSON.parse(data);
  } catch (e) {
    throw new ImportError(i18n.tc("import_errors.json_parse_error", null, {file: (item.content as File).name}));
  }

  for (const [groupString, groupsData] of Object.entries(jsonData)) {
    if (typeof groupsData === "string") {
      // IF NO GROUPS, DEFAULT GROUP
      groups[DEFAULT_GROUP_NAME].push(Key.map({
        name: groupString,
        values: [Value.map({
          name: groupsData,
          languageName: item.language,
        })],
      }));
    } else {
      groups[groupString] = groups[groupString] || [];

      for (const [key, maybeValues] of Object.entries(groupsData)) {
        // IF ARRAY OF VALUES, MULTIPLE VALUES
        groups[groupString].push(Key.map({
          name: key,
          values: (maybeValues as string).split(/[^\\]\|/).map(value => Value.map({
            name: value,
          })),
        }));
      }
    }
  }

  return insertValuesToProject(project, groups, item.language);
}

export const importWebJson = async (project: Project, item: ImportItem): Promise<Project> => {
  if (typeof item.content === "string") {
    return jsonTranslationFromJSON(item.content as string, project, item);
  } else {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(item.content as File);

      reader.onload = (result) => {
        try {
          resolve(jsonTranslationFromJSON(result.target.result.toString(), project, item));
        } catch (e) {
          reject(e);
        }
      }

      reader.onerror = () => {
        reject(new ImportError(i18n.tc("import_errors.reading_file_error", null, {file: (item.content as File).name})));
      };
    });
  }
};
