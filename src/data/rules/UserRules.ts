
export const userEmailRules = (required: string, notValid: string) => [
    (v: string) => !!v || required,
    (v: string) => /.+@.+\..+/.test(v) || notValid,
];

export const userPasswordLoginRules = (required: string) => [
    (v: string) => !!v || required
];

export const userPasswordRules = (required: string, length: string, strong: string) => [
    (v: string) => !!v || required,
    (v: string) => v.length >= 6 || length,
    (v: string) => /(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{6}/.test(v) || strong
];

export const userPasswordCopyRules = (userPassword: string, required: string, identical: string) => [
    (v: string) => !!v || required,
    (v: string) => v === userPassword || identical
];

export const optionalUsernameRules = (length: string) => [
    (v: string) => (!v || v.length === 0 ||(/(?=.*[a-z]).{3}/.test(v))) || length
];