
export class Locale {
    displayableText: string;
    value: string;

    constructor(displayableText: string, value: string) {
      this.displayableText = displayableText;
      this.value = value;
    }
    public static getLocales(): Locale[] {
        return [
            new Locale("FR", "fr"),
            new Locale("EN", "en")
        ]
    }
}