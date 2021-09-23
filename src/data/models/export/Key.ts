
export default class Key {
    groupId: number | null;
    name: string;
    isPlural: boolean;
    quantity: string | null;
    values: {[languageName: string]: string};

    constructor(
        groupId: number | null,
        name: string, 
        values: {[languageName: string]: string}, 
        isPlural: boolean, 
        quantity: string | null) {
        this.groupId = groupId;
        this.name = name;
        this.values = values;
        this.isPlural = isPlural;
        this.quantity = quantity;
    }

    public static map(json: any): Key {
        return new this(json.groupId, json.name, json.values, json.isPlural, json.quantity);
    }
}