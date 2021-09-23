
export default class Group {
    name: string | null;
    id: number | null;

    constructor(name: string | null, id: number | null) {
        this.name = name;
        this.id = id;
    }

    public static map(json: any): Group {
        return new this(json.id, json.name);
    }
}