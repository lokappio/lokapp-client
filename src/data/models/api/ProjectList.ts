
export default class ProjectList {
    id: number;
    name: string;
    color: string;
    description: string;

    constructor(id: number, name: string, color: string, description: string) {
        this.id = id
        this.name = name
        this.color = color
        this.description = description 
    }
    
    public static map(json: any): ProjectList {
        return new this(json.id, json.name, json.color, json.description);
    }
}
