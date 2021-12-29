export default class ProjectCompact {
    id: number;
    name: string;
    color: string;
    description: string;
    
    public static map(json: Partial<ProjectCompact>): ProjectCompact {
        const project: ProjectCompact = new ProjectCompact();

        project.id = json.id;
        project.name = json.name;
        project.color = json.color;
        project.description = json.description;

        return project;
    }
}
