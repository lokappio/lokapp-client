import Project from "@/data/models/api/Project";
import ImportItem from "@/data/models/ImportItem";
import Group from "@/data/models/api/Group";
import {DEFAULT_GROUP_NAME} from "@/data/helpers/constants";
import i18n from "@/i18n";
import ImportError from "@/data/models/ImportError";
import {checkAllValuesCreatedAndAdd} from "@/data/services/imports/import_configuration";
import { insertValueToKey } from "./utils";

const jsonTranslationFromJSON = (data: string, project: Project, item: ImportItem, createGroups: boolean): Project => {
  let jsonData: Record<string, any>;
  try {
    jsonData = JSON.parse(data);
  } catch (e) {
    throw new ImportError(i18n.tc("import_errors.json_parse_error", null, {file: (item.content as File).name}));
  }

  const defaultGroup = Group.empty(DEFAULT_GROUP_NAME);

  for (const groupString in jsonData) {
    // KEY HAS NO GROUP SO GROUPSTRING REPRESENT KEY, PLACE IT IN COMMON GROUP
    if (typeof jsonData[groupString] === "string") {
      let group = project.groups.find(group => group.name === DEFAULT_GROUP_NAME);
      if (group === undefined && createGroups) {
        project.warnings.push(new ImportError(i18n.tc("import_errors.no_group_found_for_key", null, {key: groupString})));
        group = defaultGroup;
      }

      insertValueToKey(
        project,
        jsonData[groupString],
        groupString,
        group.keys,
        item.language,
        createGroups,
      );
    } else {
      const group = createGroups ?
        Group.empty(groupString)
        : project.groups.find(group => group.name === groupString);

      for (const keyString in jsonData[groupString]) {
        insertValueToKey(
          project,
          jsonData[groupString][keyString],
          keyString,
          group.keys,
          item.language,
          createGroups,
        );
      }

      if (createGroups) {
        project.groups.push(group);
      }
    }
  }

  if (createGroups) {
    const indexOfCommon = project.groups.findIndex(group => group.name === DEFAULT_GROUP_NAME);

    //IF NO DEFAULT GROUP HAS BEEN FOUND, CREATE IT
    if (indexOfCommon === -1) {
      project.groups.push(defaultGroup);
    }
    // IF DEFAULT GROUP (COMMON) ALREADY EXISTS IN PROJECT, MERGE IT WITH DEFAULT GROUP
    else {
      project.groups[indexOfCommon].keys = [...defaultGroup.keys, ...project.groups[indexOfCommon].keys];
    }
  }

  return project;
}

const readFile = async (project: Project, item: ImportItem, createGroups: boolean): Promise<Project> => {
  if (typeof item.content === "string") {
    return jsonTranslationFromJSON(item.content as string, project, item, createGroups);
  } else {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(item.content as File);

      reader.onload = (result) => {
        try {
          resolve(jsonTranslationFromJSON(result.target.result.toString(), project, item, createGroups));
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

export const projectTranslationFromJSONFiles = async function (project: Project, items: ImportItem[], fromExistingProject: boolean): Promise<Project> {
  //FIRST FILE IS USED TO FILL THE GROUPS AND KEYS OF THE PROJECT (AND ADD VALUES)
  // NEXT FILES ARE USED TO ADD THE VALUES ONLY
  project = await readFile(project, items[0], !fromExistingProject);

  for (const item of items.slice(1)) {
    project = await readFile(project, item, false);
  }

  checkAllValuesCreatedAndAdd(project);

  return project;
};
