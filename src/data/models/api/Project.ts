import NewGroup from "@/data/models/api/NewGroup";
import Language from "@/data/models/api/Language";
import NewKey from "@/data/models/api/NewKey";

export default class Project {
  id: number;
  name: string;
  color: string;
  description: string;
  languages: Language[];
  groups: NewGroup[];

  static map(data: Partial<Project>): Project {
    const project: Project = new Project();

    project.id = data.id;
    project.name = data.name;
    project.color = data.color;
    project.description = data.description;

    return project;
  }

  addKey(group: NewGroup | null, key: NewKey): void {
    const currGroupIndex: number = this.groups.findIndex((group) => group.id === key.groupId);

    if(currGroupIndex != -1) {
      this.groups[currGroupIndex].keys.push(key);
    } else {
      this.groups.push(group);
      this.groups[this.groups.length - 1].keys.push(key);
    }
  }

  updateKey(key: NewKey): void {
    const currGroupIndex: number = this.groups.findIndex((group) => group.id === key.groupId);
    const currKeyIndex: number = this.groups[currGroupIndex].keys.findIndex((currKey) => currKey.id === key.id);

    this.groups[currGroupIndex].keys[currKeyIndex] = Object.assign({}, key);
  }

  deleteKey(key: NewKey): void {
    const currGroupIndex: number = this.groups.findIndex((group) => group.id === key.groupId);
    const currKeyIndex: number = this.groups[currGroupIndex].keys.findIndex((currKey) => currKey.id === key.id);

    this.groups[currGroupIndex].keys.splice(currKeyIndex, 1);
  }
}