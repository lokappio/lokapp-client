import Project from "@/data/models/api/Project";
import ImportItem from "@/data/models/ImportItem";
import Group from "@/data/models/api/Group";
import Key from "@/data/models/api/Key";
import Value from "@/data/models/api/Value";


const stringsFile = async (content: File, createGroups: boolean, project: Project, languageName: string): Promise<Project> => {
  const reader = new FileReader();
  reader.readAsText(content);

  return new Promise((resolve, reject) => {
    reader.onload = (result) => {
      const fileString: string = result.target.result.toString();

      console.log(fileString);
      fileString.split("\n").forEach((line) => {
        const includeLineComment = line.includes("//");
        const includeMultipleLineComment = line.includes("/*");

        if (includeLineComment || includeMultipleLineComment) {
          const group = (includeLineComment ?
            line.split("//")[1].trim() :
            line.split("/*")[1].split("*/")[0])
            .replace("MARK: -", "")
            .replace("MARK:", "")
            .trim();

          if(!project.groups.map(group => group.name).includes(group) && createGroups) {
            project.groups.push(Group.empty(group));
          }
        } else if(line != "") {
          const keyString = line.split("=")[0].split("\"")[1].split("\"")[0].trim();
          const valueString = line.split("=")[1].split("\"")[1].split("\"")[0].trim();

          const group = project.groups.filter(group => keyString.includes(group.name))
            ?.reduce((a, b) => a?.name?.length > b?.name?.length ? a : b, null);

          if (group) {
            const key = Key.map({name: keyString.replace(group.name + "_", ""), isPlural: false});
            key.values.push(Value.map({name: valueString, languageName: languageName}));

            group.keys.push(key);
          }
        }
      });
    };

    resolve(project);
  });
};

const stringsDictFile = async (content: File, createGroups: boolean, project: Project, languageName: string): Promise<Project> => {
  const reader = new FileReader();
  reader.readAsText(content);

  return new Promise((resolve, reject) => {
    reader.onload = (result) => {
      const fileString: string = result.target.result.toString();
      console.log(fileString);

      fileString.split("\n").forEach((line) => {
          if (line.includes("<!--")) {
            const group = line.split("<!--")[1].split("-->")[0]
              .replace("MARK: -", "")
              .replace("MARK:", "")
              .trim()

            if (!project.groups.map(group => group.name).includes(group) && createGroups) {
              project.groups.push(Group.empty(group));
            }
          }
        }
      );

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(fileString, "text/xml");

      console.log(xmlDoc);

      resolve(project);
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

  console.log(project);

  return null;
};