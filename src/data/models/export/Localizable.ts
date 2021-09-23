
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

export default class Localizable {
    name: string | null;
    localizations: Array<LocalizableKey>;

    constructor(name: string | null, localizations: Array<LocalizableKey>) {
        this.name = name;
        this.localizations = localizations;
    }

    public static map(json: any): Localizable {
        return new this(json.name, json.localizations);
    }
}