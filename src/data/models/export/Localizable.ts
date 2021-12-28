
export class LocalizableKey {
    key: string;
    type: string;
    [languageName: string]: string | {[quantity: string]: string};

    constructor(key: string, type: string) {
        this.key = key;
        this.type = type;
    }

    public static map(json: any): LocalizableKey {
        return new this(json.key, json.type);
    }
}