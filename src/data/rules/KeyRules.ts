import i18n from "@/i18n";

export const keyNameRules = () => [
    (v: string) => !!v || i18n.tc('rules.required'),
    (v: string) => v.length > 0 || i18n.tc("rules.key_name_length"),
];