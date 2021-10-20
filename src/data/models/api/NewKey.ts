import NewValue from "@/data/models/api/NewValue";

export default class NewKey {
  id: number;
  name: string;
  isPlural: boolean;
  groupId: number;
  values: NewValue[]

  public static map(data: Partial<NewKey>): NewKey {
    const key = new NewKey();

    key.id = data.id;
    key.name = data.name;
    key.isPlural = data['is_plural'];
    key.groupId = data['group_id'];

    return key;
  }

  public static empty(): NewKey {
    const key = new NewKey();

    key.name = "";
    key.isPlural = false;

    return key;
  }
}