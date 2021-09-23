
export default class Key {
    id: number;
    name: string;
    isPlural: boolean;

    constructor(id: number, name: string, isPlural: boolean) {
        this.id = id;
        this.name = name;
        this.isPlural = isPlural;
    }

    public static map(json: any): Key {
        return new this(json.id, json.name, json.is_plural);
    }
}