import NewKey from "@/data/models/api/NewKey";

export default class NewGroup {
  id: number;
  name: string;
  keys: NewKey[];

  get isDefault(): boolean { return this.name === "common"}

  public static map(data: Partial<NewGroup>): NewGroup {
    const group: NewGroup = new NewGroup();

    group.id = data.id;
    group.name = data.name;

    return group;
  }

  public static empty(name: string): NewGroup {
    const group: NewGroup = new NewGroup();

    group.id = -1;
    group.name = name;

    return group;
  }
}