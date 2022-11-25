import Project from "@/data/models/api/Project";
import ImportItem from "@/data/models/ImportItem";
import ImportError from "@/data/models/ImportError";
import i18n from "@/i18n";
import {checkAllValuesCreatedAndAdd} from "@/data/services/imports/import_configuration";
import { insertValuesToProject, insertValueToKey, KeyGroups } from "./utils";
import { DEFAULT_GROUP_NAME } from "@/data/helpers/constants";
import Key from "@/data/models/api/Key";
import Value, { ValueQuantity } from "@/data/models/api/Value";

const insertValueToKeySingular = (items: HTMLCollectionOf<Element>, project: Project, language: string, createGroups: boolean): Project => {
  let groups: KeyGroups = {};

  for (let i = 0; i < items.length; i++) {
    const keyXml = items[i].getAttribute("name");
    const valueXml = items[i].innerHTML;

    const groupNames = Object.keys(groups).sort((a, b) => b.length - a.length);
    const groupName: string = groupNames.find(group => keyString.startsWith(group)) || DEFAULT_GROUP_NAME;

    if (!groups[groupName]) groups[groupName] = [];

    const keyString = keyXml.replace(groupName + "_", "")

    groups[groupName].push(Key.map({
      name: keyString,
      values: [
        Value.map({
          name: valueXml,
          languageName: language,
        })
      ],
    }));
  }

  return insertValuesToProject(project, groups, createGroups, language);
};

const insertValueToKeyPlural = (items: HTMLCollectionOf<Element>, project: Project, language: string, createGroups: boolean) => {
  let groups: KeyGroups = {};

  for (let i = 0; i < items.length; i++) {
    const keyXml = items[i].getAttribute("name");
    const values: HTMLCollectionOf<Element> = items[i].getElementsByTagName("item");

    const groupNames = Object.keys(groups).sort((a, b) => b.length - a.length);
    const groupName: string = groupNames.find(group => keyString.startsWith(group)) || DEFAULT_GROUP_NAME;

    if (!groups[groupName]) groups[groupName] = [];

    const keyString = keyXml.replace(groupName + "_", "")

    if(values.length !== 3) {
      throw new ImportError(i18n.tc("import_errors.quantity_missing", null, {"key": keyXml}));
    }

    for (let j = 0; j < values.length; j++) {
      const quantity = values[j].getAttribute("quantity");
      const valueXml = values[j].innerHTML;
      const valueQuantity = Object.values(ValueQuantity).find(value => value === quantity);

      if (valueQuantity) {
        const value = Value.map({
          name: valueXml,
          quantityString: valueQuantity,
          languageName: language,
          keyId: key.id,
        });

        key.values.push(value);
      } else {
        throw new ImportError(i18n.tc("import_errors.quantity_not_found", null, {"quantity": quantity, "key": keyXml}));
      }
  }

  return insertValuesToProject(project, groups, createGroups, language);
};


const jsonTranslationFromXML = (data: string, project: Project, item: ImportItem, createGroups: boolean): Project => {
  let groups: KeyGroups = {};

  const groupNames = data.match(/<!--\s*MARK:\s+([A-z0-9]+)\s*-->/);
  if (groupNames) {
    for (const group of groupNames) {
      groups[group] = [];
    }
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data, "text/xml");

  const plurals = xmlDoc.getElementsByTagName("plural");

  return project;
};

const readFile = async (project: Project, item: ImportItem, createGroups: boolean): Promise<Project> => {
  if (typeof item.content === "string") {
    return jsonTranslationFromXML(item.content as string, project, item, createGroups);
  } else {
    const reader = new FileReader();
    reader.readAsText(item.content as File);

    return await new Promise((resolve, reject) => {
      reader.onload = (result) => {
        try {
          resolve(jsonTranslationFromXML(result.target.result.toString(), project, item, createGroups));
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

export const projectTranslationFromXMLFiles = async function (project: Project, items: ImportItem[], fromExistingProject: boolean): Promise<Project> {
  //FIRST FILE IS USED TO FILL THE GROUPS AND KEYS OF THE PROJECT (AND ADD VALUES)
  // NEXT FILES ARE USED TO ADD THE VALUES ONLY
  project = await readFile(project, items[0], !fromExistingProject);

  for (const item of items.slice(1)) {
    project = await readFile(project, item, false);
  }

  checkAllValuesCreatedAndAdd(project);

  return project;
};
