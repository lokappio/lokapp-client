import { DEFAULT_GROUP_NAME } from "@/data/helpers/constants";
import Group from "@/data/models/api/Group";
import Key from "@/data/models/api/Key";
import Project from "@/data/models/api/Project";
import Value, { ValueQuantity } from "@/data/models/api/Value";
import ImportError from "@/data/models/ImportError";
import i18n from "@/i18n";

export function descape(data: string): string {
  data = data.trim();

  if (!data.startsWith('"') || !data.endsWith('"')) {
    return data;
  }

  data = data.slice(1, -1);

  let res = '';
  for (let i = 0; i < data.length; i++) {
    if (data[i] === '\\' && data[i + 1] != undefined) {
      res += data[i + 1];
      i++;
    } else if (data[i] === '\\' && data[i + 1] === undefined) {
      throw new ImportError(`Cannot escape last character: "${data}"`);
    } else {
      res += data[i];
    }
  }

  return res;
}

export type KeyGroups = { [grouName: string]: Key[] };

export const insertValueToKey = (project: Project, values: string[], keyString: string, groupName: string, language: string) => {
  const allKeys = project.groups.find(e => e.name === groupName).keys;
  const maybeKey = allKeys.find(key => key.name === keyString);
  const key = maybeKey === undefined ? Key.map({
    name: keyString,
    values: [],
    isPlural: false,
  }) : maybeKey;

  if (values.length != 1 && values.length != 3) {
    project.warnings.push(new ImportError(i18n.t("import_errors.quantity_not_found_json", {key: keyString, value: values}).toString()));
  } else {
    // MUTATE KEY
    key.isPlural = values.length > 1;
    key.values = [...key.values,...values.map((valueString, i) =>
      Value.map({
        name: valueString.trim(),
        quantityString: values.length === 1 ? null : Object.values(ValueQuantity)[i],
        languageName: language,
        keyId: key.id || undefined,
      })
    )];

    // MUTATE PROJECT
    const resGroups = project.groups.filter(group => group.name !== groupName);
    const resKeys = project.groups.find(e => e.name === groupName).keys.filter(e => e.name !== keyString);

    project.groups = [...resGroups, Group.map({
      name: groupName,
      keys: [...resKeys, key],
    })];
  }
};

export const insertValuesToProject = (project: Project, keygroups: KeyGroups, languageName: string): Project => {
  const indexOfCommon = project.groups.findIndex(group => group.name === DEFAULT_GROUP_NAME);
  const defaultGroup = Group.empty(DEFAULT_GROUP_NAME);

  let newProject: Project = Project.map(project);

  //IF NO DEFAULT GROUP HAS BEEN FOUND, CREATE IT
  if (indexOfCommon === -1) {
    newProject.groups.push(defaultGroup);
  }
  // IF DEFAULT GROUP (COMMON) ALREADY EXISTS IN PROJECT, MERGE IT WITH DEFAULT GROUP
  else {
    newProject.groups[indexOfCommon].keys = [...defaultGroup.keys, ...project.groups[indexOfCommon].keys];
  }

  for (const groupName of Object.keys(keygroups)) {
    const keys = keygroups[groupName];

    if (!project.groups.map(g => g.name).includes(groupName)) {
      project.groups.push(Group.empty(groupName));
    }

    for (const key of keys) {
      const values = key.values.map(e => e.name);

      insertValueToKey(newProject, values, key.name, groupName, languageName);
    }
  }

  return newProject;
}
