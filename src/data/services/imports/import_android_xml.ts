import Project from "@/data/models/api/Project";
import ImportItem from "@/data/models/ImportItem";
import ImportError from "@/data/models/ImportError";
import i18n from "@/i18n";
import { descape, insertValuesToProject, KeyGroups } from "./utils";
import { DEFAULT_GROUP_NAME } from "@/data/helpers/constants";
import Key from "@/data/models/api/Key";
import Value, { ValueQuantity } from "@/data/models/api/Value";

const insertValueToKeySingular = (items: HTMLCollectionOf<Element>, project: Project, language: string, groups: KeyGroups): Project => {
  for (let i = 0; i < items.length; i++) {
    const keyXml = items[i].getAttribute("name");
    const valueXml = items[i].innerHTML;

    const groupNames = project.groups.map(e => e.name).sort((a, b) => b.length - a.length);
    const groupName: string = groupNames.find(group => keyXml.startsWith(group)) || DEFAULT_GROUP_NAME;
    const keyString = keyXml.replace(groupName + "_", "")

    groups[groupName].push(Key.map({
      name: keyString,
      values: [
        Value.map({
          name: descape(valueXml),
          languageName: language,
        })
      ],
    }));
  }

  return insertValuesToProject(project, groups, language);
};

const insertValueToKeyPlural = (items: HTMLCollectionOf<Element>, project: Project, language: string, groups: KeyGroups) => {
  for (let i = 0; i < items.length; i++) {
    const keyXml = items[i].getAttribute("name");
    const valuesXml: HTMLCollectionOf<Element> = items[i].getElementsByTagName("item");

    const groupNames = project.groups.map(e => e.name).sort((a, b) => b.length - a.length);
    const groupName: string = groupNames.find(group => keyXml.startsWith(group)) || DEFAULT_GROUP_NAME;

    const keyString = keyXml.replace(groupName + "_", "")

    if (valuesXml.length !== 3) {
      throw new ImportError(i18n.tc("import_errors.quantity_missing", null, {"key": keyXml}));
    }

    const values: Value[] = [];

    for (let j = 0; j < valuesXml.length; j++) {
      const quantity = valuesXml[j].getAttribute("quantity");
      const valueXml = valuesXml[j].innerHTML;
      const valueQuantity = Object.values(ValueQuantity).find(value => value === quantity);

      if (valueQuantity) {
        values.push(Value.map({
          name: valueXml,
          quantityString: valueQuantity,
          languageName: language,
        }));

      } else {
        throw new ImportError(i18n.tc("import_errors.quantity_not_found", null, {"quantity": quantity, "key": keyXml}));
      }
    }

    groups[groupName].push(
      Key.map({
        name: keyString,
        values,
      })
    );
  }

  return insertValuesToProject(project, groups, language);
};

const jsonTranslationFromXML = (data: string, project: Project, item: ImportItem): Project => {
  const groups: KeyGroups = {};

  const groupNames = data.matchAll(/<!--\s*([A-z_0-9]+)\s*-->/g);
  groups[DEFAULT_GROUP_NAME] = [];

  if (groupNames) {
    for (const match of groupNames) {
      const groupName = match[1]
      groups[groupName] = [];
    }
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data, "text/xml");

  const plurals = xmlDoc.getElementsByTagName("plural");
  const singular = xmlDoc.getElementsByTagName("string");

  project = insertValueToKeyPlural(plurals, project, item.language, groups);
  project = insertValueToKeySingular(singular, project, item.language, groups);

  return project;
};

export const importAndroidXml = async (project: Project, item: ImportItem): Promise<Project> => {
  if (typeof item.content === "string") {
    return jsonTranslationFromXML(item.content as string, project, item);
  } else {
    const reader = new FileReader();
    reader.readAsText(item.content as File);

    return await new Promise((resolve, reject) => {
      reader.onload = (result) => {
        try {
          resolve(jsonTranslationFromXML(result.target.result.toString(), project, item));
        } catch (e) {
          reject(e);
        }
      }

      reader.onerror = () => {
        reject(new ImportError(i18n.tc("import_errors.reading_file_error", null, {file: (item.content as File).name})));
      }
    })
  }
}
