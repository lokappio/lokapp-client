import Project from "@/data/models/api/Project";
import ImportItem from "@/data/models/ImportItem";
import Group from "@/data/models/api/Group";
import {DEFAULT_GROUP_NAME} from "@/data/helpers/constants";
import Key from "@/data/models/api/Key";
import Value, {ValueQuantity} from "@/data/models/api/Value";
import ImportError from "@/data/models/ImportError";
import i18n from "@/i18n";

const jsonTranslationFromJSON = async (project: Project, item: ImportItem, createGroups: boolean): Promise<Project> => {
  const reader = new FileReader();
  reader.readAsText(item.content);

  return new Promise((resolve, reject) => {
    reader.onload = (result) => {
      let jsonData: Record<string, any>
      try {
        jsonData = JSON.parse(result.target.result.toString());
      } catch (e) {
        //TODO: THROW ERROR IF JSON IS NOT VALID
        console.log("error reading json. Check the format of your json file")
      }

      //DEFAULT GROUP
      const defaultGroup = Group.empty(DEFAULT_GROUP_NAME);

      for(const groupString in jsonData) {
        let group = createGroups ?
          Group.empty(groupString)
          : project.groups.find(group => group.name === groupString);

        const groupValues = jsonData[groupString];

        if(typeof groupValues === "string") {
          // GROUPSTRING REPRESENT KEY, PLACE IT IN COMMON GROUP
          group = project.groups.find(group => group.name === groupString) ?? createGroups ? defaultGroup : null;
          const key = createGroups ?
            Key.map({name: groupString, isPlural: false})
            : group.keys.find(key => key.name === groupString);

          const valueString = jsonData[groupString];
          const valuesList: string[] = valueString.split("|");

          //TODO: IF VALUESLIST.LENGTH < 3 AND VALUE != 1, THROW ERROR quantity_not_found

          key.isPlural = valuesList.length > 1;
          valuesList.forEach((valueString, index) => {
            // ZERO | ONE | OTHER
            const value = Value.map({
              name: valueString.trim(),
              quantityString: valuesList.length === 1 ? null : Object.values(ValueQuantity)[index],
              languageName: item.language})

            key.values.push(value);
          })

          if(createGroups) group.keys.push(key);
        } else {
          for(const keyString in jsonData[groupString]) {
            const key = createGroups ?
              Key.map({name: keyString, isPlural: false})
              : group.keys.find(key => key.name === keyString);

            const valueString = jsonData[groupString][keyString];
            const valuesList: string[] = valueString.split("|");

            //TODO: IF VALUESLIST.LENGTH < 3 AND VALUE != 1, THROW ERROR quantity_not_found

            key.isPlural = valuesList.length > 1;
            valuesList.forEach((valueString, index) => {
              // ZERO | ONE | OTHER
              const value = Value.map({
                name: valueString.trim(),
                quantityString: valuesList.length === 1 ? null : Object.values(ValueQuantity)[index],
                languageName: item.language})

              key.values.push(value);
            })

            if(createGroups) group.keys.push(key);
          }
          if(createGroups) project.groups.push(group);
        }

      }

      if(createGroups) {
        const indexOfCommon = project.groups.findIndex(group => group.name === DEFAULT_GROUP_NAME)

        if(indexOfCommon === -1){
          project.groups.push(defaultGroup);
        } else {
          // IF DEFAULT GROUP (COMMON) ALREADY EXISTS IN PROJECT, MERGE IT WITH DEFAULT GROUP
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