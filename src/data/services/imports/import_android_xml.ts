import Project from "@/data/models/api/Project";
import Group from "@/data/models/api/Group";
import Key from "@/data/models/api/Key";
import Value, {ValueQuantity} from "@/data/models/api/Value";
import ImportItem from "@/data/models/ImportItem";
import {DEFAULT_GROUP_NAME} from "@/data/helpers/constants";

const insertValueToKey = (items: HTMLCollectionOf<Element>, project: Project, language: string, isPlural: boolean, pushToGroup: boolean) => {
  for (let i = 0; i < items.length; i++) {
    const keyXml = items[i].getAttribute("name");
    const valueXml = items[i].innerHTML; //IF SINGULAR
    const values = items[i].getElementsByTagName("item"); // IF PLURAL

    const group = project.groups.filter(group => keyXml.includes(group.name))
        ?.reduce((a, b) => a?.name?.length > b?.name?.length ? a : b, null)
      ?? project.groups.find((group) => group.name === DEFAULT_GROUP_NAME);

    const key = pushToGroup ? Key.map({name: keyXml.replace(group.name + "_", ""), isPlural: isPlural}) : group.keys.find(key => key.name === keyXml.replace(group.name + "_", ""));

    if(isPlural) {
      for (let j = 0; j < values.length; j++) {
        const quantity = values[j].getAttribute("quantity");
        const valueXml = values[j].innerHTML;
        const value = Value.map({name: valueXml, quantityString: ValueQuantity[quantity], languageName: language});

        key.values.push(value);
      }
    } else {
      // IF SINGULAR
      const value = Value.map({name: valueXml, languageName: language});
      key.values.push(value);
    }

    if(pushToGroup) group.keys.push(key);
  }
}

const jsonTranslationFromXML = async (project: Project, item: ImportItem, createGroups: boolean): Promise<Project> => {
  const reader = new FileReader();
  reader.readAsText(item.content);

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
          // if no groups were found or no group with name common, create a default one
          project.groups.push(Group.empty(DEFAULT_GROUP_NAME));
        }
      }

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");

      const plurals = xmlDoc.getElementsByTagName("plural");
      const singular = xmlDoc.getElementsByTagName("string");

      insertValueToKey(singular, project, item.language, false, createGroups);
      insertValueToKey(plurals, project, item.language, true, createGroups);

      resolve(project);
    }
  })
}

export const jsonTranslationFromXMLFiles = async function (project: Project,items: ImportItem[]): Promise<Project> {
  //FIRST FILE IS USED TO FILL THE GROUPS AND KEYS OF THE PROJECT (AND ADD VALUES)
  // NEXT FILES ARE USED TO ADD THE VALUES ONLY
  project = await jsonTranslationFromXML(project, items[0], true);

  for (const item of items.slice(1)) {
    project = await jsonTranslationFromXML(project, item, false);
  }

  return project;
};
