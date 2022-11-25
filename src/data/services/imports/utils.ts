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

export const insertValuesToProject = (project: Project, keygroups: KeyGroups, createGroups: boolean, languageName: string): Project => {
  for (const groupName in Object.keys(keygroups)) {
    const keys = keygroups[groupName];

    if (!project.groups.map(g => g.name).includes(groupName) && createGroups) {
      project.groups.push(Group.empty(groupName));
    }

    for (const key of keys) {
      let values = key.values.map(e => e.name);

      insertValueToKey(project, values, key.name, keys, languageName, createGroups);
    }
  }

  return project;
}

export const insertValueToKey = (project: Project, values: string[], keyString: string, keys: Key[], language: string, pushToGroup: boolean) => {
  let needKeyCreation = false;

  let key = pushToGroup ?
    Key.map({name: keyString, isPlural: false})
    : keys.find(key => key.name === keyString);

  if (key === undefined) {
    /**
     * IF SEVERAL FILES, MEANS THAT KEY EXIST IN SECOND FILE BUT NOT FIRST
     * INSERT KEY TO GROUP (EMPTY VALUES ARE CREATED IN {@link checkAllValuesCreatedAndAdd} METHOD)
     */

    key = Key.map({name: keyString, isPlural: false});
    needKeyCreation = true;
  }

  if (values.length != 1 && values.length != 3) {
    if (pushToGroup) {
      project.warnings.push(new ImportError(i18n.t("import_errors.quantity_not_found_json", {key: keyString, value: values}).toString()));
    }
  } else {
    key.isPlural = values.length > 1;

    values.forEach((valueString, index) => {
      // ZERO | ONE | OTHER
      const value = Value.map({
        name: valueString.trim(),
        quantityString: values.length === 1 ? null : Object.values(ValueQuantity)[index],
        languageName: language,
        keyId: key.id
      });

      key.values.push(value);
    });

    if (pushToGroup || needKeyCreation) {
      keys.push(key);
    }
  }
};
