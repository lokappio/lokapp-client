import Project from "@/data/models/api/Project";
import ImportItem from "@/data/models/ImportItem";
import Group from "@/data/models/api/Group";
import Key from "@/data/models/api/Key";
import Value, {ValueQuantity} from "@/data/models/api/Value";
import ImportError from "@/data/models/ImportError";
import i18n from "@/i18n";
import {DEFAULT_GROUP_NAME} from "@/data/helpers/constants";
import {checkAllValuesCreatedAndAdd} from "@/data/services/imports/import_configuration";

const insertValueToKey = (keyString: string, values: Value[], isPluralKey: boolean, project: Project, createGroups: boolean) => {
  let group = project.groups.filter(group => keyString.includes(group.name))
    ?.reduce((a, b) => a?.name?.length > b?.name?.length ? a : b, null);

  if (!group) {
    project.warnings.push(new ImportError(i18n.tc("import_errors.no_group_found_for_key", null,{key: keyString})));
    group = project.groups.find((group) => group.name === DEFAULT_GROUP_NAME);
  }

  keyString = keyString.replace(group.name + "_", "")
  let key = createGroups ?
    Key.map({name: keyString, isPlural: isPluralKey})
    : group.keys.find(key => key.name === keyString);
  let needKeyCreation = false;

  if (key === undefined) {
    /**
     * IF SEVERAL FILES, MEANS THAT KEY EXIST IN SECOND FILE BUT NOT FIRST
     * INSERT KEY TO GROUP (EMPTY VALUES ARE CREATED IN {@link checkAllValuesCreatedAndAdd} METHOD)
     */
    key = Key.map({name: keyString, isPlural: isPluralKey})
    needKeyCreation = true;
  }
  key.values.push(...values);

  if(createGroups || needKeyCreation) {
    group.keys.push(key);
  }
}

//.strings FILES == WHERE SINGULAR KEYS ARE DEFINED
const stringsFile = async (content: File, createGroups: boolean, project: Project, languageName: string): Promise<Project> => {
  const reader = new FileReader();
  reader.readAsText(content);

  return new Promise((resolve, reject) => {
    reader.onload = (result) => {
      const fileString: string = result.target.result.toString();

      fileString.split("\n").forEach((line) => {
        const includeLineComment = line.includes("//");
        const includeMultipleLineComment = line.includes("/*");

        //IF LINE IS A COMMENT,
        if (includeLineComment || includeMultipleLineComment) {
          const group = (includeLineComment ?
            line.split("//")[1].trim() :
            line.split("/*")[1].split("*/")[0])
            .replace("MARK: -", "")
            .replace("MARK:", "")
            .trim();

          if (!project.groups.map(group => group.name).includes(group) && createGroups) {
            project.groups.push(Group.empty(group));
          }
        }
        //IF LINE IS NOT A COMMENT AND NOT EMPTY
        else if (line != "") {
          const keyString = line.split("=")[0].split("\"")[1].split("\"")[0].trim();
          const valueString = line.split("=")[1].split("\"")[1].split("\"")[0].trim();

          insertValueToKey(keyString, [Value.map({name: valueString, languageName: languageName})], false, project, createGroups);
        }
      });

      resolve(project);
    };
  });
};

//.stringsdict FILES == WHERE PLURAL KEYS ARE DEFINED
const stringsDictFile = async (content: File, createGroups: boolean, project: Project, languageName: string): Promise<Project> => {
  const reader = new FileReader();
  reader.readAsText(content);

  return new Promise((resolve, reject) => {
    reader.onload = (result) => {
      const fileString: string = result.target.result.toString();

      fileString.split("\n").forEach((line) => {
          if (line.includes("<!--")) {
            const group = line.split("<!--")[1].split("-->")[0]
              .replace("MARK: -", "")
              .replace("MARK:", "")
              .trim();

            if (!project.groups.map(group => group.name).includes(group) && createGroups) {
              project.groups.push(Group.empty(group));
            }
          }
        }
      );

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(fileString, "text/xml");

      const globalDictItems = [...xmlDoc.getElementsByTagName("dict")[0].children];
      globalDictItems.forEach((child, indexGlobal) => {
        if (child.nodeName === "dict") {
          const keyString = globalDictItems[indexGlobal - 1].innerHTML;
          //IF ERROR ON RETRIEVE globalDictItems[indexGlobal - 1], THROW FILE FORMAT ERROR

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

          insertValueToKey(keyString, values, true, project, createGroups);
        }
      });

      resolve(project);
    };

    reader.onerror = () => {
      reject(new ImportError(i18n.tc("import_errors.reading_file_error", null, {file: content.name})));
    }
  });
};

const jsonTranslationFromStrings = async (project: Project, item: ImportItem, createGroups: boolean): Promise<Project> => {
  for (const content of item.content) {
    const extension = content.name.split(".").pop();

    switch (extension) {
      case "strings":
        project = await stringsFile(content, createGroups, project, item.language);
        break;
      case "stringsdict":
        project = await stringsDictFile(content, createGroups, project, item.language);
        break;
    }
  }

  return project;
};

export const projectTranslationFromStringsFiles = async function (project: Project, items: ImportItem[]): Promise<Project> {
  //READ ALL FILES (strings + stringsdist)
  project = await jsonTranslationFromStrings(project, items[0], true);

  for (const item of items.slice(1)) {
    project = await jsonTranslationFromStrings(project, item, false);
  }

  checkAllValuesCreatedAndAdd(project);

  return project;
};