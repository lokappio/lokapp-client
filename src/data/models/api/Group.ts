import Key from "@/data/models/api/Key";
import {DEFAULT_GROUP_NAME} from "@/data/helpers/constants";

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

    return group;
  }

  public static empty(name: string): Group {
    const group: Group = new Group();

    group.id = -1;
    group.name = name;

    return group;
  }
}