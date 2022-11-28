import Project from "@/data/models/api/Project";
import ImportItem from "@/data/models/ImportItem";
import ImportError from "@/data/models/ImportError";
import i18n from "@/i18n";
import { descape, insertValuesToProject, KeyGroups } from "./utils";
import { DEFAULT_GROUP_NAME } from "@/data/helpers/constants";
import Key from "@/data/models/api/Key";
import Value, { ValueQuantity } from "@/data/models/api/Value";

const insertValueToKeySingular = (items: HTMLCollectionOf<Element>, project: Project, language: string): Project => {
  const groups: KeyGroups = {};

  for (let i = 0; i < items.length; i++) {
    const keyXml = items[i].getAttribute("name");
    const valueXml = items[i].innerHTML;

    const groupNames = project.groups.map(e => e.name).sort((a, b) => b.length - a.length);
    const groupName: string = groupNames.find(group => keyXml.startsWith(group)) || DEFAULT_GROUP_NAME;
    const keyString = keyXml.replace(groupName + "_", "")

    if (groups[groupName] === undefined) groups[groupName] = [];

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

const insertValueToKeyPlural = (items: HTMLCollectionOf<Element>, project: Project, language: string) => {
  const groups: KeyGroups = {};

  for (let i = 0; i < items.length; i++) {
    const keyXml = items[i].getAttribute("name");
    const valuesXml: HTMLCollectionOf<Element> = items[i].getElementsByTagName("item");

    const groupNames = project.groups.map(e => e.name).sort((a, b) => b.length - a.length);
    const groupName: string = groupNames.find(group => keyXml.startsWith(group)) || DEFAULT_GROUP_NAME;

    if (!groups[groupName]) groups[groupName] = [];

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

  const groupNames = data.match(/<!--\s*MARK:\s+([A-z0-9]+)\s*-->/);
  if (groupNames) {
    for (const group of groupNames) {
      groups[group] = [];
    }
  }

  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data, "text/xml");

  const plurals = xmlDoc.getElementsByTagName("plural");
  const singular = xmlDoc.getElementsByTagName("string");

  project = insertValueToKeyPlural(plurals, project, item.language);
  project = insertValueToKeySingular(singular, project, item.language);

  return project;
};

const readFile = async (project: Project, item: ImportItem): Promise<Project> => {
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

export const projectTranslationFromXMLFiles = async function (project: Project, items: ImportItem[]): Promise<Project> {
  //FIRST FILE IS USED TO FILL THE GROUPS AND KEYS OF THE PROJECT (AND ADD VALUES)
  // NEXT FILES ARE USED TO ADD THE VALUES ONLY
  project = await readFile(project, items[0]);

  for (const item of items.slice(1)) {
    project = await readFile(project, item);
  }

  return project;
};
