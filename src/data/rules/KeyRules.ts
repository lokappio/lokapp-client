
export const keyNameRules = (required: string, length: string, snakeCaseOnly: string) => [
    (v: string) => !!v || required,
    (v: string) => v.length > 2 || length,
    (v: string) => /^([a-z0-9]+)(([a-z0-9]|_)+)([a-z0-9]+)$/.test(v) || snakeCaseOnly
];