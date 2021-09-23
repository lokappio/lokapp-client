
export const colorRules = (required: string, length: string, validColor: string) => [
    (v: string) => !!v || required,
    (v: string) => v.length === 6 || length,
    (v: string) => /([A-Fa-f0-9]{6})$/i.test(v) || validColor
];