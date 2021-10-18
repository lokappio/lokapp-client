import NewKey from "@/data/models/api/NewKey";

export default class NewGroup {
  id: number;
  name: string;
  keys: NewKey[];

  public static map(data: Partial<NewGroup>): NewGroup {
    const group: NewGroup = new NewGroup();

    group.id = data.id;
    group.name = data.name;

    return group;
  }
}