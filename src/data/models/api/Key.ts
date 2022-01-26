import Value from "@/data/models/api/Value";

export type partialKey = Partial<Key> &
  {
    'is_plural'?: boolean;
    'group_id'?: number;
  };

export default class Key {
  id: number;
  name: string;
  isPlural: boolean;
  groupId: number;
  values: Value[] = [];

  public static map(data: partialKey): Key {
    const key = new Key();

    key.id = data.id;
    key.name = data.name;
    key.isPlural = data['is_plural'];
    key.groupId = data['group_id'];

    return key;
  }

  public static empty(): Key {
    const key = new Key();

    key.name = "";
    key.isPlural = false;

    return key;
  }
}