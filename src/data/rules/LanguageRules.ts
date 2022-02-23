import i18n from "@/i18n";

export const languageNameRules = () => [
    (v: string) => !!v || i18n.tc('rules.required'),
    (v: string) => !v || v.length > 0 || i18n.tc("rules.language_name_length")
];