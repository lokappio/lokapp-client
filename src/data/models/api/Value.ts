
export default class Value {
    keyId: number;
    keyName: string;
    valueId: number;
    valueName: string;
    quantity: string;
    isPlural: boolean;
    languageId: number;
    languageName: string;
    groupId: number;
    groupName: string;

    constructor(
        keyId: number,
        keyName: string,
        valueId: number,
        valueName: string,
        quantity: string,
        isPlural: boolean,
        languageId: number,
        languageName: string,
        groupId: number,
        groupName: string) {
        this.keyId = keyId;
        this.keyName = keyName;
        this.valueId = valueId;
        this.valueName = valueName;
        this.languageId = languageId;
        this.languageName = languageName;
        this.groupId = groupId;
        this.groupName = groupName;
        this.quantity = quantity;
        this.isPlural = isPlural;
    }

    public static map(json: any): Value {
        return new this(json.key_id,
                        json.key_name,
                        json.value_id,
                        json.value_name,
                        json.quantity,
                        json.is_plural,
                        json.language_id,
                        json.language_name,
                        json.group_id,
                        json.group_name);
    }
}