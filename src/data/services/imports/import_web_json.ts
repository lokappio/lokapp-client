import Project from "@/data/models/api/Project";
import ImportItem from "@/data/models/ImportItem";
import Group from "@/data/models/api/Group";
import {DEFAULT_GROUP_NAME} from "@/data/helpers/constants";
import Key from "@/data/models/api/Key";
import Value, {ValueQuantity} from "@/data/models/api/Value";
import i18n from "@/i18n";
import ImportError from "@/data/models/ImportError";
import {checkAllValuesCreatedAndAdd} from "@/data/services/imports/import_configuration";

const insertValueToKey = (project: Project, values: string, keyString: string, keys: Key[], language: string, pushToGroup: boolean, reject: (reason: string) => any) => {
  let needKeyCreation = false;

  let key = pushToGroup ?
    Key.map({name: keyString, isPlural: false})
    : keys.find(key => key.name === keyString);

  if (key === undefined) {
    /**
     * IF SEVERAL FILES, MEANS THAT KEY EXIST IN SECOND FILE BUT NOT FIRST
     * INSERT KEY TO GROUP (EMPTY VALUES ARE CREATED IN {@link checkAllValuesCreatedAndAdd} METHOD)
     */

    key = Key.map({name: keyString, isPlural: false});
    needKeyCreation = true;
  }

  const valuesList: string[] = values.split("|");

  if (valuesList.length != 1 && valuesList.length != 3) {
    if (pushToGroup) {
      project.warnings.push(new ImportError(i18n.t("import_errors.quantity_not_found_json", {key: keyString, value: values}).toString()));
    }
  } else {
    key.isPlural = valuesList.length > 1;

    valuesList.forEach((valueString, index) => {
      // ZERO | ONE | OTHER
      const value = Value.map({
        name: valueString.trim(),
        quantityString: valuesList.length === 1 ? null : Object.values(ValueQuantity)[index],
        languageName: language,
        keyId: key.id
      });

      key.values.push(value);
    });

    if (pushToGroup || needKeyCreation) {
      keys.push(key);
    }
  }
};

const jsonTranslationFromJSON = async (project: Project, item: ImportItem, createGroups: boolean): Promise<Project> => {
  const reader = new FileReader();
  reader.readAsText(item.content as File);

  return new Promise((resolve, reject) => {
    reader.onload = (result) => {
      let jsonData: Record<string, any>;
      try {
        jsonData = JSON.parse(result.target.result.toString());
      } catch (e) {
        reject(new ImportError(i18n.tc("import_errors.json_parse_error", null, {file: (item.content as File).name})));
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
            reject
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
              reject
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

      resolve(project);
    };

    reader.onerror = () => {
      reject(new ImportError(i18n.tc("import_errors.reading_file_error", null, {file: (item.content as File).name})));
    }
  });
};

export const projectTranslationFromJSONFiles = async function (project: Project, items: ImportItem[], fromExistingProject: boolean): Promise<Project> {
  //FIRST FILE IS USED TO FILL THE GROUPS AND KEYS OF THE PROJECT (AND ADD VALUES)
  // NEXT FILES ARE USED TO ADD THE VALUES ONLY
  project = await jsonTranslationFromJSON(project, items[0], true);

  for (const item of items.slice(1)) {
    project = await jsonTranslationFromJSON(project, item, false);
  }

  checkAllValuesCreatedAndAdd(project);

  return project;
};