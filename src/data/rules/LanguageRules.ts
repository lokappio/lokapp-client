
export const languageNameRules = (required: string, length: string, validCharacters: string) => [
    (v: string) => !!v || required,
    (v: string) => v.length >= 2 || length,
    (v: string) => (/^[a-zA-Z]+$/.test(v)) || validCharacters
];

export const optionalLanguageRules = (length: string, validCharacters: string) => [
    (v: string) => (!v || v.length === 0 || v.length >= 2) || length,
    (v: string) => (!v || v.length === 0 || (/^[a-zA-Z]+$/.test(v))) || validCharacters
];