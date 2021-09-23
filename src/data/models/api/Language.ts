
export default class Language {
    id: number;
    name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    public static map(json: any): Language {
        return new this(json.id, json.name);
    }
}