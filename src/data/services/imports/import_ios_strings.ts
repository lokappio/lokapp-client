import Project from "@/data/models/api/Project";
import ImportItem, {ItemIOS} from "@/data/models/ImportItem";
import Value, {ValueQuantity} from "@/data/models/api/Value";
import ImportError from "@/data/models/ImportError";
import i18n from "@/i18n";
import {DEFAULT_GROUP_NAME} from "@/data/helpers/constants";
import IOSParser from "./ios_parser";
import { insertValuesToProject, KeyGroups } from "./utils";
import Key from "@/data/models/api/Key";
import Group from "@/data/models/api/Group";

const stringsDictTranslation = (data: string, project: Project, languageName: string, fileName: string): Project => {
  const groups: KeyGroups = {};
  groups[DEFAULT_GROUP_NAME] = [];

  const groupNames = data.matchAll(/<!--\s*MARK:\s+-\s+([A-z_0-9]+)\s*-->/g);
  if (groupNames) {
    for (const match of groupNames) {
      let groupName = match[1]
      groups[groupName] = [];
      project.groups.push(Group.empty(groupName));
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
            values.push(Value.map({
              name: translations[index + 1].innerHTML,
              quantityString: valueQuantity,
            }));
          }
        }
      });

      if (keyString === null) {
        throw new ImportError(i18n.tc("import_errors.stringsdict_parse_error", null, {file: fileName}));
      }

      const groupNames = project.groups.map(e => e.name).sort((a, b) => b.length - a.length);
      const groupName = groupNames.find(group => keyString.startsWith(group)) || DEFAULT_GROUP_NAME;

      groups[groupName].push(Key.map({
        name: keyString.replace(groupName + "_", "").trim(),
        values: values,
      }));
    }
  });
  return insertValuesToProject(project, groups, languageName);
}

const stringsTranslation = (data: string, project: Project, languageName: string): Project => {
  const tokens = IOSParser(data);

  const groups: KeyGroups = {};
  groups[DEFAULT_GROUP_NAME] = [];

  const groupNames = data.matchAll(/\/\/\s*MARK:\s+-\s+([A-z_0-9]+)/g);
  if (groupNames) {
    for (const match of groupNames) {
      let groupName = match[1]
      groups[groupName] = [];
      project.groups.push(Group.empty(groupName));
    }
  }

  for (const token of tokens) {
    const groupNames = project.groups.map(e => e.name).sort((a, b) => b.length - a.length);
    const groupName = groupNames.find(group => token.key.startsWith(group)) || DEFAULT_GROUP_NAME;

    groups[groupName].push(Key.map({
      name: token.key.replace(groupName + "_", ""),
      values: [Value.map({
        name: token.value,
      })],
    }));
  }

  return insertValuesToProject(project, groups, languageName);
}

//.strings FILES == WHERE SINGULAR KEYS ARE DEFINED
const stringsFile = async (content: File | string, project: Project, languageName: string): Promise<Project> => {
  if(typeof content === "string") {
    return stringsTranslation(content, project, languageName);
  } else {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(content);

      reader.onload = (result) => {
        try {
          resolve(stringsTranslation(result.target.result.toString(), project, languageName));
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
const stringsDictFile = async (content: File | string, project: Project, languageName: string): Promise<Project> => {
  if (typeof content === "string") {
    return stringsDictTranslation(content, project, languageName, "");
  } else {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(content);

      reader.onload = (result) => {
        try {
          resolve(stringsDictTranslation(result.target.result.toString(), project, languageName, content.name));
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

export const importIOSStrings = async (project: Project, item: ImportItem): Promise<Project> => {
  for (const content of (item.content as (ItemIOS | File)[])) {
    const extension = item.fromTest ? (content as ItemIOS).extension : (content as File).name.split(".").pop();

    switch (extension) {
      case "strings":
        return await stringsFile(item.fromTest ? (content as ItemIOS).content : (content as File), project, item.language);
      case "stringsdict":
        return await stringsDictFile(item.fromTest ? (content as ItemIOS).content : (content as File), project, item.language);
    }
  }
};
