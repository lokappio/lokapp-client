import i18n from "@/i18n";

export const importRules = () => [
  (v: string) => !!v || i18n.tc('rules.required'),
];

export const iOSImportRules = () => [
  (v: string) => !!v || i18n.tc('rules.required'),
  (v: string) => {
    return !v || v.length < 1 && v.length > 2 || i18n.tc("rules.max_files");
  }
]