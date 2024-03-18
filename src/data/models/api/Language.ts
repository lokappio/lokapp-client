


export enum LanguageAccess {
    all = "all",
    source = "source",
    target = "target"
}

export default class Language {
    id: number;
    name: string;
    access: LanguageAccess;

    public static map(data: Partial<Language>): Language {
        const language: Language = new Language();

        language.id = data.id;
        language.name = data.name;
        language.access = data.access;

        return language;
    }
}