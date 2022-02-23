import i18n from "@/i18n";

export const groupNameRules = () => [
    (v: string) => !!v || i18n.tc('rules.required'),
    (v: string) => v.length > 0 || i18n.tc("rules.group_name_length"),
    (v: string) => /^([a-z0-9]*)(([a-z0-9]|_)*)([a-z0-9]+)$/.test(v) || i18n.tc("rules.snake_case_only")
];