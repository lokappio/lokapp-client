import Language from "@/data/models/api/Language";
import {replaceMarkers} from "./export_configuration";
import {LocalizedGroup, Plural} from "@/data/models/api/Project";
import {FileData} from "@/data/models/types/export";
import {KeyType, Platform} from "@/data/models/enums/project";

const generateWebStringFile = (language: Language, localizedProject: LocalizedGroup[]): FileData => {
  const platform = Platform.WEB;
  const jsonFile: any = {};

  localizedProject.forEach((localizedGroup) => {
    jsonFile[localizedGroup.name] = {};
    const currGroup = jsonFile[localizedGroup.name];

    if (localizedGroup.localizations.length !== 0) {
      localizedGroup.localizations.forEach((localization) => {
        if (localization.type === KeyType.SINGULAR) {
          const value = (localization[language.id]?.toString() ?? "").replace(/"/g, "\\\"");
          currGroup[localization?.key] = replaceMarkers(value, platform);
        } else {
          const values: Plural = localization[language.id] as Plural;

          if (values) {
            currGroup[localization?.key] = `${values.zero} | ${values.one} | ${values.other}`;
          } else {
            currGroup[localization?.key] = "";
          }
        }
      });
    }
  });

  return {language: language.name.toLowerCase(), content: JSON.stringify(jsonFile, null, "\t")};
};

export const generateWebStringFiles = (languages: Array<Language>, localizedObjects: LocalizedGroup[]): FileData[] => {
  return languages.map((language: Language) => generateWebStringFile(language, localizedObjects));
};