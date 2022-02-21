import i18n from "@/i18n";

export const colorRules = () => [
    (v: string) => !!v || i18n.tc('rules.required'),
    (v: string) => v.length === 6 || i18n.tc("rules.color_length"),
    (v: string) => /([A-Fa-f0-9]{6})$/i.test(v) || i18n.tc("rules.not_hexa_value")
];