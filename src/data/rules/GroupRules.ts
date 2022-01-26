import i18n from "@/i18n";

export const groupNameRules = (length: string, snakeCaseOnly: string) => [
    (v: string) => !!v || i18n.tc('rules.required'),
    (v: string) => v.length > 2 || length,
    (v: string) => /^([a-z0-9]+)(([a-z0-9]|_)+)([a-z0-9]+)$/.test(v) || snakeCaseOnly
];