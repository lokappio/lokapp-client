import Group from "@/data/models/api/Group";
import Language from "@/data/models/api/Language";
import Key from "@/data/models/api/Key";
import {KeyType} from "@/data/models/enums/project";
import {groupBy} from "@/data/helpers/utils";
import Value from "@/data/models/api/Value";

export class Plural {
  other = "";
  one = "";
  zero = "";
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
  createdAt: Date;
  updatedAt: Date;
  description: string;
  languages: Language[] = [];
  groups: Group[];

  static map(data: Partial<Project>): Project {
    const project: Project = new Project();

    project.id = data.id;
    project.name = data?.name ?? "";
    project.color = data?.color ?? "";
    project.description = data?.description ?? "";
    project.createdAt = data.createdAt;
    project.updatedAt = data.updatedAt;

    return project;
  }

  static mapEntire(data: Partial<Project>): Project {
    const project: Project = Project.map(data);
    project.groups = data.groups.map((group) => {
      const currGroup = Group.map(group);

      currGroup.keys = group.keys.map((key) => {
        const currKey = Key.map(key);
        currKey.values = key.values.map((value) => Value.map(value));
        return currKey;
      });

      return currGroup;
    });

    project.languages = data.languages.map((language) => Language.map(language));

    return project;
  }

  get toLocalizedProject(): LocalizedGroup[] {
    const localized: LocalizedGroup[] = [];

    this.groups.forEach((group) => {
      const localizedGroup: LocalizedGroup = new LocalizedGroup();
      localizedGroup.name = group.name;

      group.keys.forEach((key) => {
        const localization = new Localization();
        localization.key = key.name;
        localization.type = key.isPlural ? KeyType.PLURAL : KeyType.SINGULAR;

        if(key.isPlural) {
          Object.entries(groupBy<Value[]>(key.values, 'languageId')).forEach((value) => {
            const pluralValue = new Plural();

            value[1].forEach((value) => {
              pluralValue[value.quantityString] = value?.name ?? ""
            });

            localization[value[0]] = pluralValue;
          })
        } else {
          key.values.forEach((value) => {
            localization[value.languageId] = value.name;
          })
        }

        localizedGroup.localizations.push(localization);
      });

      localized.push(localizedGroup);
    });

    return localized;
  }

  addKey(group: Group | null, key: Key): void {
    const currGroupIndex: number = this.groups.findIndex((group) => group.id === key.groupId);

    if(currGroupIndex != -1) {
      this.groups[currGroupIndex].keys.push(key);
    } else {
      this.groups.push(group);
      this.groups[this.groups.length - 1].keys.push(key);
    }
  }

  updateKey(key: Key): void {
    const currGroupIndex: number = this.groups.findIndex((group) => group.id === key.groupId);
    const currKeyIndex: number = this.groups[currGroupIndex].keys.findIndex((currKey) => currKey.id === key.id);

    this.groups[currGroupIndex].keys[currKeyIndex] = Object.assign(Key.map({}), key);
  }

  updateValue(value: Value): void {
    this.groups.forEach((group, index) => {
      const associatedGroupIndex = index;
      const associatedKeyIndex = group.keys.findIndex((key) => key.id == value.keyId);

      if(associatedKeyIndex != -1) {
        const associatedKey = this.groups[associatedGroupIndex].keys[associatedKeyIndex];
        const associatedValueIndex = associatedKey.values.findIndex((valueProject) => valueProject.id === value.id);

        associatedKey.values[associatedValueIndex] = Object.assign(Value.map({}), value);
      }
    })
  }

  updateLanguages(data: {language: Language; values: Value[]}) {
    this.languages.push(data.language);

    this.groups.forEach((group, index) => {
      data.values.forEach((value) => {
        const associatedGroupIndex = index;
        const associatedKeyIndex = group.keys.findIndex((key) => key.id == value.keyId);

        if(associatedKeyIndex != -1) {
          const associatedKey = this.groups[associatedGroupIndex].keys[associatedKeyIndex];
          associatedKey.values.push(value);
        }
      });
    });
  }

  deleteKey(key: Key): void {
    const currGroupIndex: number = this.groups.findIndex((group) => group.id === key.groupId);
    const currKeyIndex: number = this.groups[currGroupIndex].keys.findIndex((currKey) => currKey.id === key.id);

    this.groups[currGroupIndex].keys.splice(currKeyIndex, 1);
  }

  deleteLanguage(language: Language): void {
    const languageIndex = this.languages.indexOf(language);
    this.languages.splice(languageIndex, 1);

    this.groups.forEach((group) => {
      group.keys.forEach((key) => {
        key.values = key.values.filter((value) => value.languageId != language.id);
      });
    });
  }

  toCreate(): {} {
    return {
      name: this.name,
      color: this.color,
      description: this.description,
    }
  }
}