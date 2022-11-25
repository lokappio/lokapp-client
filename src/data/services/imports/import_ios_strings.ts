import Project from "@/data/models/api/Project";
import ImportItem, {ItemIOS} from "@/data/models/ImportItem";
import Value, {ValueQuantity} from "@/data/models/api/Value";
import ImportError from "@/data/models/ImportError";
import i18n from "@/i18n";
import {DEFAULT_GROUP_NAME} from "@/data/helpers/constants";
import {checkAllValuesCreatedAndAdd} from "@/data/services/imports/import_configuration";
import IOSParser from "./ios_parser";
import { insertValuesToProject, KeyGroups } from "./utils";
import Key from "@/data/models/api/Key";

const stringsDictTranslation = (data: string, project: Project, createGroups: boolean, languageName: string, fileName: string): Project => {
  let groups: KeyGroups = {};

  const groupNames = data.match(/<!--\s*MARK:\s+([A-z0-9]+)\s*-->/);
  if (groupNames) {
    for (const group of groupNames) {
      groups[group] = [];
    }
  }

  const fileString: string = data;
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(fileString, "text/xml");

  const globalDictItems = [...xmlDoc.getElementsByTagName("dict")[0].children];
  globalDictItems.forEach((child, indexGlobal) => {
    if (child.nodeName === "dict") {
      let keyString: string = null;

      try {
        if (globalDictItems[indexGlobal - 1].nodeName !== "key"){
          throw new ImportError(i18n.tc("import_errors.stringsdict_parse_error", null, {file: fileName}));
        }

        keyString = globalDictItems[indexGlobal - 1].innerHTML;
      } catch (_) {
        throw new ImportError(i18n.tc("import_errors.stringsdict_parse_error", null, {file: fileName}));
      }

      const values: Value[] = [];
      const translations = [...child.getElementsByTagName("dict")[0].children];
      translations.forEach((tag, index) => {
        if (tag.nodeName === "key") {
          const quantityString = tag.innerHTML;
          const valueQuantity = Object.values(ValueQuantity).find(value => value === quantityString);

          if (valueQuantity) {
            const value = Value.map({name: translations[index + 1].innerHTML, quantityString: valueQuantity, languageName: languageName});
            values.push(value);
          }
        }
      });

      if (keyString === null) {
        throw new ImportError(i18n.tc("import_errors.stringsdict_parse_error", null, {file: fileName}));
      }

      const groupNames = Object.keys(groups).sort((a, b) => b.length - a.length);
      let groupName = groupNames.find(group => keyString.startsWith(group)) || DEFAULT_GROUP_NAME;

      groups[groupName].push(Key.map({
        name: keyString.replace(groupName, "").trim(),
        values: values,
      }));
    }
  });

  return insertValuesToProject(project, groups, createGroups, languageName);
}

const stringsTranslation = (data: string, project: Project, createGroups: boolean, languageName: string): Project => {
  const tokens = IOSParser(data);

  let currentGroupName = DEFAULT_GROUP_NAME;

  let groups: KeyGroups = {};

  for (const token of tokens) {
    if (token.type === "section") {
      currentGroupName = token.value;
      continue;
    }

    if (!groups.hasOwnProperty(currentGroupName)) {
      groups[currentGroupName] = [];
    }

    let key = Key.map({
      name: token.value.key,
      values: [Value.map({name: token.value.value, languageName: languageName})]
    });

    groups[currentGroupName].push(key);
  }

  return insertValuesToProject(project, groups, createGroups, languageName);
}

//.strings FILES == WHERE SINGULAR KEYS ARE DEFINED
const stringsFile = async (content: File | string, createGroups: boolean, project: Project, languageName: string): Promise<Project> => {
  if(typeof content === "string") {
    return stringsTranslation(content, project, createGroups, languageName);
  } else {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(content);

      reader.onload = (result) => {
        try {
          resolve(stringsTranslation(result.target.result.toString(), project, createGroups, languageName));
        } catch (e) {
          reject(e);
        }
      };

      reader.onerror = () => {
        reject(new ImportError(i18n.tc("import_errors.reading_file_error", null, {file: content.name})));
      }
    });
  }
};

//.stringsdict FILES == WHERE PLURAL KEYS ARE DEFINED
const stringsDictFile = async (content: File | string, createGroups: boolean, project: Project, languageName: string): Promise<Project> => {
  if (typeof content === "string") {
    return stringsDictTranslation(content, project, createGroups, languageName, "");
  } else {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(content);

      reader.onload = (result) => {
        try {
          resolve(stringsDictTranslation(result.target.result.toString(), project, createGroups, languageName, content.name));
        } catch (e) {
          reject(e);
        }
      };

      reader.onerror = () => {
        reject(new ImportError(i18n.tc("import_errors.reading_file_error", null, {file: content.name})));
      }
    });
  }
};

const jsonTranslationFromStrings = async (project: Project, item: ImportItem, createGroups: boolean): Promise<Project> => {
  for (const content of (item.content as (ItemIOS | File)[])) {
    const extension = item.fromTest ? (content as ItemIOS).extension : (content as File).name.split(".").pop();

    switch (extension) {
      case "strings":
        project = await stringsFile(item.fromTest ? (content as ItemIOS).content : (content as File), createGroups, project, item.language);
        break;
      case "stringsdict":
        project = await stringsDictFile(item.fromTest ? (content as ItemIOS).content : (content as File), createGroups, project, item.language);
        break;
    }
  }

  return project;
};

export const projectTranslationFromStringsFiles = async function (project: Project, items: ImportItem[], fromExistingProject: boolean): Promise<Project> {
  //READ ALL FILES (strings + stringsdist)
  if (!fromExistingProject) {
    project = await jsonTranslationFromStrings(project, items[0], !fromExistingProject);
  }

  for (const item of fromExistingProject ? items : items.slice(1)) {
    project = await jsonTranslationFromStrings(project, item, false);
  }

  checkAllValuesCreatedAndAdd(project);

  return project;
};
