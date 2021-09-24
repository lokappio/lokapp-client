import Key from "@/data/models/api/Key";

export default class NewGroup {
  id: number;
  name: string;
  keys: Key[];

  public static map(data: Partial<NewGroup>): NewGroup {
    const group: NewGroup = new NewGroup();

    group.id = data.id;
    group.name = data.name;

    return group;
  }
}