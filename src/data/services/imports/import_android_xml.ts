import Project from "@/data/models/api/Project";
import Group from "@/data/models/api/Group";
import Key from "@/data/models/api/Key";
import Value, {ValueQuantity} from "@/data/models/api/Value";
import ImportItem from "@/data/models/ImportItem";
import {DEFAULT_GROUP_NAME} from "@/data/helpers/constants";
import ImportError from "@/data/models/ImportError";
import i18n from "@/i18n";
import {checkAllValuesCreatedAndAdd} from "@/data/services/imports/import_configuration";

const insertValueToKey = (items: HTMLCollectionOf<Element>, project: Project, language: string, isPlural: boolean, pushToGroup: boolean, reject: (reason: string) => any) => {
  let needKeyCreation = false;

  for (let i = 0; i < items.length; i++) {
    const keyXml = items[i].getAttribute("name");
    const valueXml = items[i].innerHTML; //IF SINGULAR
    const values: HTMLCollectionOf<Element> = items[i].getElementsByTagName("item"); // IF PLURAL

    let group = project.groups.filter(group => keyXml.includes(group.name))
      ?.reduce((a, b) => a?.name?.length > b?.name?.length ? a : b, null);

    if (!group) {
      project.warnings.push(new ImportError(i18n.tc("import_errors.no_group_found_for_key", null,{key: keyXml})));
      group = project.groups.find((group) => group.name === DEFAULT_GROUP_NAME);
    }

    const keyString = keyXml.replace(group.name + "_", "")

    let key = pushToGroup ?
      Key.map({name: keyString, isPlural: isPlural})
      : group.keys.find(key => key.name === keyString);

    if (key === undefined) {
      /**
       * IF SEVERAL FILES, MEANS THAT KEY EXIST IN SECOND FILE BUT NOT FIRST
       * INSERT KEY TO GROUP (EMPTY VALUES ARE CREATED IN {@link checkAllValuesCreatedAndAdd} METHOD)
       */

      key = Key.map({name: keyString, isPlural: isPlural});
      needKeyCreation = true;
    }

    if (isPlural) {
      if(values.length !== 3) {
        reject(i18n.tc("import_errors.quantity_missing", null, {"key": keyXml}));
      }

      for (let j = 0; j < values.length; j++) {
        const quantity = values[j].getAttribute("quantity");
        const valueXml = values[j].innerHTML;
        const valueQuantity = Object.values(ValueQuantity).find(value => value === quantity);

        if (valueQuantity) {
          const value = Value.map({name: valueXml, quantityString: valueQuantity, languageName: language});
          key.values.push(value);
        } else {
          reject(i18n.tc("import_errors.quantity_not_found", null, {"quantity": quantity, "key": keyXml}));
        }
      }
    } else {
      // IF SINGULAR
      const value = Value.map({name: valueXml, languageName: language});
      key?.values.push(value);
    }

    if (pushToGroup || needKeyCreation) {
      group.keys.push(key);
    }
  }
};

const jsonTranslationFromXML = async (project: Project, item: ImportItem, createGroups: boolean): Promise<Project> => {
  const reader = new FileReader();
  reader.readAsText(item.content as File);

  return new Promise((resolve, reject) => {
    reader.onload = (result) => {
      const xmlString: string = result.target.result.toString();

      if (createGroups) {
        xmlString.split("\n").forEach((line) => {
          if (line.includes("<!--")) {
            const group = line.split("<!--")[1].split("-->")[0].trim();

            project.groups.push(Group.empty(group));
          }
        });

        if (project.groups.length === 0 || project.groups.findIndex((group) => group.name === DEFAULT_GROUP_NAME) === -1) {
          if (project.groups.length === 0) {
            project.warnings.push(new ImportError(i18n.tc("import_errors.no_group_found")));
          }
          // if no groups were found or no group with name common, create a default one
          project.groups.push(Group.empty(DEFAULT_GROUP_NAME));
        }
      }

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");

      const plurals = xmlDoc.getElementsByTagName("plural");
      const singular = xmlDoc.getElementsByTagName("string");

      insertValueToKey(
        singular,
        project,
        item.language,
        false, createGroups,
        (error) => reject(new ImportError(error))
      );

      insertValueToKey(
        plurals,
        project,
        item.language,
        true,
        createGroups,
        (error) => reject(new ImportError(error))
      );

      resolve(project);
    };

    reader.onerror = () => {
      reject(new ImportError(i18n.tc("import_errors.reading_file_error", null, {file: (item.content as File).name})));
    }
  });
};

export const projectTranslationFromXMLFiles = async function (project: Project, items: ImportItem[]): Promise<Project> {
  //FIRST FILE IS USED TO FILL THE GROUPS AND KEYS OF THE PROJECT (AND ADD VALUES)
  // NEXT FILES ARE USED TO ADD THE VALUES ONLY
  project = await jsonTranslationFromXML(project, items[0], true);

  for (const item of items.slice(1)) {
    project = await jsonTranslationFromXML(project, item, false);
  }

  checkAllValuesCreatedAndAdd(project);

  return project;
};
