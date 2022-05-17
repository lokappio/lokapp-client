import Project from "@/data/models/api/Project";
import ImportItem from "@/data/models/ImportItem";
import Group from "@/data/models/api/Group";
import {DEFAULT_GROUP_NAME} from "@/data/helpers/constants";
import Key from "@/data/models/api/Key";
import Value, {ValueQuantity} from "@/data/models/api/Value";
import i18n from "@/i18n";
import ImportError from "@/data/models/ImportError";

const insertValueToKey = (project: Project, values: string, keyString: string, keys: Key[], language: string, pushToGroup: boolean, reject: (reason: string) => any) => {

  const key = pushToGroup ?
    Key.map({name: keyString, isPlural: false})
    : keys.find(key => key.name === keyString);

  const valuesList: string[] = values.split("|");

  if(valuesList.length != 1 && valuesList.length != 3) {
    project.warnings.push(new ImportError(i18n.t("import_errors.quantity_not_found_json", {key: keyString, value: values}).toString()));
  } else {
    key.isPlural = valuesList.length > 1;

    valuesList.forEach((valueString, index) => {
      // ZERO | ONE | OTHER
      const value = Value.map({
        name: valueString.trim(),
        quantityString: valuesList.length === 1 ? null : Object.values(ValueQuantity)[index],
        languageName: language})

      key.values.push(value);
    })

    if(pushToGroup) keys.push(key);
  }
}

const jsonTranslationFromJSON = async (project: Project, item: ImportItem, createGroups: boolean): Promise<Project> => {
  const reader = new FileReader();
  reader.readAsText(item.content);

  return new Promise((resolve, reject) => {
    reader.onload = (result) => {
      let jsonData: Record<string, any>
      try {
        jsonData = JSON.parse(result.target.result.toString());
      } catch (e) {
        reject(new ImportError(i18n.tc("import_errors.json_parse_error")));
      }

      const defaultGroup = Group.empty(DEFAULT_GROUP_NAME);

      for(const groupString in jsonData) {
        // KEY HAS NO GROUP SO GROUPSTRING REPRESENT KEY, PLACE IT IN COMMON GROUP
        if(typeof jsonData[groupString] === "string") {
          let group = project.groups.find(group => group.name === DEFAULT_GROUP_NAME)
          if(group === undefined && createGroups) {
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

          for(const keyString in jsonData[groupString]) {
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

          if(createGroups) project.groups.push(group);
        }
      }

      if(createGroups) {
        const indexOfCommon = project.groups.findIndex(group => group.name === DEFAULT_GROUP_NAME)

        //IF NO DEFAULT GROUP HAS BEEN FOUND, CREATE IT
        if(indexOfCommon === -1){
          project.groups.push(defaultGroup);
        }
        // IF DEFAULT GROUP (COMMON) ALREADY EXISTS IN PROJECT, MERGE IT WITH DEFAULT GROUP
        else {
          project.groups[indexOfCommon].keys = [...defaultGroup.keys, ...project.groups[indexOfCommon].keys];
        }
      }

      resolve(project);
    };
  });
};

export const jsonTranslationFromJSONFiles = async function (project: Project, items: ImportItem[]): Promise<Project> {
  //FIRST FILE IS USED TO FILL THE GROUPS AND KEYS OF THE PROJECT (AND ADD VALUES)
  // NEXT FILES ARE USED TO ADD THE VALUES ONLY
  project = await jsonTranslationFromJSON(project, items[0], true);

  for (const item of items.slice(1)) {
    project = await jsonTranslationFromJSON(project, item, false);
  }

  return project;
};