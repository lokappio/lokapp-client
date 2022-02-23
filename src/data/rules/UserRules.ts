import i18n from "@/i18n";

export const userEmailRules = () => [
    (v: string) => !!v || i18n.tc('rules.required'),
    (v: string) => /.+@.+\..+/.test(v) || i18n.tc("rules.mail_valid"),
];

export const userPasswordLoginRules = () => [
    (v: string) => !!v || i18n.tc('rules.required')
];

export const userPasswordRules = () => [
    (v: string) => !!v || i18n.tc('rules.required'),
    (v: string) => v.length >= 6 || i18n.tc("rules.password_length"),
    (v: string) => /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6}/.test(v) || i18n.tc("rules.password_strong")
];

export const userPasswordCopyRules = (userPassword: string) => [
    (v: string) => !!v || i18n.tc('rules.required'),
    (v: string) => v === userPassword || i18n.tc("rules.password_identical")
];