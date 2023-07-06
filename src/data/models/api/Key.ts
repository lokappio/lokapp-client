import Value from "@/data/models/api/Value";

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
}
