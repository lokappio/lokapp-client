
export default class Language {
    name: string;
    id: number;

    constructor(name: string, id: number) {
        this.name = name;
        this.id = id;
    }

    public static map(json: any): Language {
        return new this(json.id, json.name);
    }
}