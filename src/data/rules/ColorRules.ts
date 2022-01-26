import i18n from "@/i18n";

export const colorRules = (length: string, validColor: string) => [
    (v: string) => !!v || i18n.tc('rules.required'),
    (v: string) => v.length === 6 || length,
    (v: string) => /([A-Fa-f0-9]{6})$/i.test(v) || validColor
];