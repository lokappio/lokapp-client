
export default class Language {
    id: number;
    name: string;

    public static map(data: Partial<Language>): Language {
        const language: Language = new Language();

        language.id = data.id;
        language.name = data.name;

        return language;
    }
}