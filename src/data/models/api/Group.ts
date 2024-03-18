import Key from "@/data/models/api/Key";
import {DEFAULT_GROUP_NAME} from "@/data/helpers/constants";
import {TranslationStatus} from "@/data/models/api/Value";

export default class Group {
  id: number;
  name: string;
  keys: Key[] = [];

  get isDefault(): boolean { return this.name === DEFAULT_GROUP_NAME}
  get isNewGroup(): boolean { return this.id === -1}

  public static map(data: Partial<Group>): Group {
    const group: Group = new Group();

    group.id = data.id;
    group.name = data.name;
    group.keys = data.keys;

    return group;
  }

  public static empty(name: string): Group {
    const group: Group = new Group();

    group.id = -1;
    group.name = name;

    return group;
  }

  valueStatuses(): Map<string, Map<TranslationStatus, number>> {
    return this.keys.reduce((acc, key) => {
      const keyStatuses = key.valueStatuses();
      keyStatuses.forEach((value, key) => {
        if (!acc.has(key)) {
          acc.set(key, value);
        } else {
          const languageMap = acc.get(key);
          value.forEach((value, key) => {
            languageMap.set(key, (languageMap.get(key) ?? 0) + value);
          });
        }
      });
      return acc;
    }, new Map<string, Map<TranslationStatus, number>>());
  }

  valuesCount(): number {
    return this.keys.reduce((acc, curr) => acc + curr.valuesCount(), 0);
  }
}
