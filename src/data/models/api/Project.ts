import NewGroup from "@/data/models/api/NewGroup";
import Language from "@/data/models/api/Language";

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
}