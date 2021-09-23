
export const projectNameRules = (required: string, length: string) => [
    (v: string) => !!v || required,
    (v: string) => v.length >= 3 || length
];