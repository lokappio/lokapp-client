import Value, {TranslationStatus} from "@/data/models/api/Value";

export default class Key {
  id: number;
  name: string;
  isPlural: boolean;
  groupId: number;
  values: Value[] = [];

  public static map(data: Partial<Key>): Key {
    const key = new Key();

    key.id = data.id;
    key.name = data.name;
    key.isPlural = data['isPlural'];
    key.groupId = data['groupId'];
    key.values = data['values'];

    return key;
  }

  public static empty(): Key {
    const key = new Key();

    key.name = "";
    key.isPlural = false;

    return key;
  }

  /**
   * Get a map values count by languages and statuses
   * @return example :
   * {
   *  "en": {
   *   "modified": 1,
   *   "validated": 1,
   *   "invalidated": 1
   *   },
   *  "fr": {
   *   "modified": 0,
   *   "validated": 3,
   *   "invalidated": 0
   *  }
   * }
   */
  valueStatuses(): Map<string, Map<TranslationStatus, number>> {
    const quantityMap = new Map<string, Map<string, number>>();
    const quantitySet = new Map<string, Set<string>>();
    const values = Object.assign([], this.values);
    return values.sort((a, b) => {
      // Order from most recent to oldest
      return b.id - a.id;
    }).reduce((acc, value) => {
      if (!acc.has(value.languageName)) {
        acc.set(value.languageName, new Map<TranslationStatus, number>());
        if (!this.isPlural) {
          acc.get(value.languageName).set(value.status, 1);
        }
      }

      if (this.isPlural) {
        const languageMap = acc.get(value.languageName);

        if (!quantityMap.has(value.languageName)) {
          quantityMap.set(value.languageName, new Map<string, number>());
          quantitySet.set(value.languageName, new Set<string>());
        }
        if (!quantityMap.get(value.languageName).has(value.status)) {
          quantityMap.get(value.languageName).set(value.status, 0);
        }

        if (!quantitySet.get(value.languageName).has(value.quantityString)) {
          quantitySet.get(value.languageName).add(value.quantityString);
          quantityMap.get(value.languageName).set(value.status, quantityMap.get(value.languageName).get(value.status) + 1);
          languageMap.set(value.status, quantityMap.get(value.languageName).get(value.status));
        }
      }

      return acc;
    }, new Map<string, Map<TranslationStatus, number>>());
  }

  valuesCount(): number {
    return this.isPlural ? 3 : 1;
  }

  matchSearch(search: string): boolean {
    return this.name.toLowerCase().includes(search.toLowerCase()) || this.values.some(value => value.name.toLowerCase().includes(search.toLowerCase()));
  }
}
