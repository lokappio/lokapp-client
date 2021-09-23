
export default class SpecificValue {
    keyId: number;
    valueId: number;
    valueName: string;
    languageId: number;
    quantity: string;

    constructor(
        keyId: number,
        valueId: number,
        valueName: string,
        languageId: number,
        quantity: string) {
        this.keyId = keyId;
        this.valueId = valueId;
        this.valueName = valueName;
        this.languageId = languageId;
        this.quantity = quantity;
    }

    public static map(json: any): SpecificValue {
        return new this(json.key_id,
                        json.id,
                        json.name,
                        json.language_id,
                        json.quantity_string);
    }
}