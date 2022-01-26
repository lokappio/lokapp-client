import i18n from "@/i18n";

export const projectNameRules = (length: string) => [
    (v: string) => !!v || i18n.tc('rules.required'),
    (v: string) => v.length >= 3 || length
];