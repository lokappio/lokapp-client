import {replaceMarkers, mixGroupAndKeyName} from "./export_configuration";
import Language from "../../models/api/Language";
import {LocalizedGroup, Plural} from "@/data/models/api/Project";
import {KeyType, Platform} from "@/data/models/enums/project";
import {FileData} from "@/data/models/types/export";
import xmlFormatter from "xml-formatter";

const generateIOSStringDictFile = (language: Language, localizedProject: LocalizedGroup[]): FileData => {
  const platform = Platform.IOS;

  const plistType = document.implementation.createDocumentType("plist", "-//Apple//DTD PLIST 1.0//EN", "http://www.apple.com/DTDs/PropertyList-1.0.dtd");
  const xmlDoc = document.implementation.createDocument("", "", plistType);

  const plistEl = xmlDoc.createElement("plist");
  plistEl.setAttribute("version", "1.0");
  const dictEl = xmlDoc.createElement("dict");

  localizedProject.forEach((localizedGroup) => {

    if (localizedGroup.localizations.find((localization) => localization.type === KeyType.PLURAL)) {
      const commentEl = xmlDoc.createComment(`MARK: ${localizedGroup.name}`);
      dictEl.appendChild(commentEl);
    }

    localizedGroup.localizations
      .filter((localization) => localization.type === KeyType.PLURAL)
      .forEach((localization) => {
        const keyEl = xmlDoc.createElement("key");
        keyEl.innerHTML = mixGroupAndKeyName(localizedGroup.name, localization.key);
        dictEl.appendChild(keyEl);

        const dictEl2 = xmlDoc.createElement("dict");

        const keyEl2 = xmlDoc.createElement("key");
        keyEl2.innerHTML = "NSStringLocalizedFormatKey";
        dictEl2.appendChild(keyEl2);

        const stringEl1 = xmlDoc.createElement("string");
        stringEl1.innerHTML = "%#@variable_name@";
        dictEl2.appendChild(stringEl1);

        const keyEl3 = xmlDoc.createElement("key");
        keyEl3.innerHTML = "variable_name";
        dictEl2.appendChild(keyEl3);

        const dictEl3 = xmlDoc.createElement("dict");

        const keyEl4 = xmlDoc.createElement("key");
        keyEl4.innerHTML = "NSStringFormatSpecTypeKey";
        dictEl3.appendChild(keyEl4);

        const stringEl2 = xmlDoc.createElement("string");
        stringEl2.innerHTML = "NSStringPluralRuleType";
        dictEl3.appendChild(stringEl2);

        const keyEl5 = xmlDoc.createElement("key");
        keyEl5.innerHTML = "NSStringFormatValueTypeKey";
        dictEl3.appendChild(keyEl5);

        const stringEl3 = xmlDoc.createElement("string");
        stringEl3.innerHTML = "d";
        dictEl3.appendChild(stringEl3);

        const values: Plural = localization[language.id] as Plural;
        if (values) {
          Object.entries(values).forEach((value) => {
            const keyEl6 = xmlDoc.createElement("key");
            keyEl6.innerHTML = value[0];
            dictEl3.appendChild(keyEl6);

            const stringEl4 = xmlDoc.createElement("string");
            stringEl4.innerHTML = replaceMarkers(value[1] ?? "", platform).replace(/"/g, "\\\"");
            dictEl3.appendChild(stringEl4);

          });
        }

        dictEl2.appendChild(dictEl3);
        dictEl.appendChild(dictEl2);
      });
  });

  plistEl.appendChild(dictEl);
  xmlDoc.appendChild(plistEl);

  let formattedXml: string = xmlFormatter(new XMLSerializer().serializeToString(xmlDoc), {collapseContent: true});
  formattedXml = `<?xml version="1.0" encoding="utf-8"?>\n ${formattedXml}`;

  return {language: language.name.toLowerCase(), content: formattedXml, plural: true};
};

const generateIOSStringFile = (language: Language, localizedProject: LocalizedGroup[]): FileData => {
  const platform = Platform.IOS;
  let exportedString = "";

  localizedProject.forEach((localizedGroup) => {
    if (localizedGroup.name != null) {
      exportedString += "// MARK: - " + localizedGroup.name + "\n\n";
    }

    localizedGroup.localizations
      .filter((localization) => localization.type === KeyType.SINGULAR)
      .forEach((localization) => {
        const value = (localization[language.id]?.toString() ?? "").replace(/"/g, "\\\"");
        exportedString += `"${mixGroupAndKeyName(localizedGroup.name, localization.key)}" = "${replaceMarkers(value, platform)}";\n`;
      });
  });
  return {language: language.name.toLowerCase(), content: exportedString, plural: false};
};

export const generateIOSStringFiles = (languages: Array<Language>, localizedObjects: LocalizedGroup[]): FileData[] => {
  const answer: any = [];
  languages.forEach((language: Language) => {
    answer.push(generateIOSStringFile(language, localizedObjects));
    answer.push(generateIOSStringDictFile(language, localizedObjects));
  });
  return answer;
};