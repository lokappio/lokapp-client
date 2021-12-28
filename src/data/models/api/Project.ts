import NewGroup from "@/data/models/api/NewGroup";
import Language from "@/data/models/api/Language";
import NewKey from "@/data/models/api/NewKey";
import {KeyType} from "@/data/models/enums/project";
import {groupBy} from "@/data/helpers/utils";
import NewValue from "@/data/models/api/NewValue";

export class Plural {
  other: string;
  one: string;
  zero: string;
}

export class Localization {
  key: string;
  type: KeyType;
  [language: string]: string | Plural;
}

export class LocalizedGroup {
  name: string; // Group name
  localizations: Localization[] = [];
}

export default class Project {
  id: number;
  name: string;
  color: string;
  description: string;
  languages: Language[];
  groups: NewGroup[];

  static map(data: Partial<Project>): Project {
    const project: Project = new Project();

    project.id = data.id;
    project.name = data.name;
    project.color = data.color;
    project.description = data.description;

    return project;
  }

  toLocalizedProject(): LocalizedGroup[] {
    const localized: LocalizedGroup[] = [];

    this.groups.forEach((group) => {
      const localizedGroup: LocalizedGroup = new LocalizedGroup();
      localizedGroup.name = group.name;

      group.keys.forEach((key) => {
        const localization = new Localization();
        localization.key = key.name;
        localization.type = key.isPlural ? KeyType.PLURAL : KeyType.SINGULAR;

        if(key.isPlural) {
          Object.entries(groupBy<NewValue[]>(key.values, 'languageName')).forEach((value) => {
            const pluralValue = new Plural();

            value[1].forEach((value) => {
              pluralValue[value.quantityString] = value.name
            });

            localization[value[0]] = pluralValue;
          })
        } else {
          key.values.forEach((value) => {
            localization[value.languageName] = value.name;
          })
        }

        localizedGroup.localizations.push(localization);
      });

      localized.push(localizedGroup);
    });

    return localized;
  }

  addKey(group: NewGroup | null, key: NewKey): void {
    const currGroupIndex: number = this.groups.findIndex((group) => group.id === key.groupId);

    if(currGroupIndex != -1) {
      this.groups[currGroupIndex].keys.push(key);
    } else {
      this.groups.push(group);
      this.groups[this.groups.length - 1].keys.push(key);
    }
  }

  updateKey(key: NewKey): void {
    const currGroupIndex: number = this.groups.findIndex((group) => group.id === key.groupId);
    const currKeyIndex: number = this.groups[currGroupIndex].keys.findIndex((currKey) => currKey.id === key.id);

    this.groups[currGroupIndex].keys[currKeyIndex] = Object.assign({}, key);
  }

  deleteKey(key: NewKey): void {
    const currGroupIndex: number = this.groups.findIndex((group) => group.id === key.groupId);
    const currKeyIndex: number = this.groups[currGroupIndex].keys.findIndex((currKey) => currKey.id === key.id);

    this.groups[currGroupIndex].keys.splice(currKeyIndex, 1);
  }
}