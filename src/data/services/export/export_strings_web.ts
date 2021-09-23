import Language from "@/data/models/export/Language";
import Localizable from "@/data/models/export/Localizable";
import { EXPORT_CONFIGURATION, replaceMarkers } from "./export_configuration";

const generateWebStringFile = (platform: any, language: Language, localizedObjects: Array<Localizable>) => {
    let exportedString = `{\n`;

    localizedObjects.forEach((groupObject: Localizable, index: number) => {
        //Check if some keys inside group
        if (groupObject.localizations.length === 0) {
            return;
        }

        let indentationKey = "    ";
        let isInAGroup = false;

        //Group without name = key at root of json
        if (groupObject.name != null) {
            indentationKey = "        ";
            isInAGroup = true;
            exportedString += `    "${groupObject.name}": {\n`;
        }

        groupObject.localizations.forEach((localization: any, indexKey: number) => {
            if (localization.type === EXPORT_CONFIGURATION.LOCALIZATION_TYPE.SINGULAR) {
                const value = localization[language.name].toString().replace(/"/g, "\\\"");
                exportedString += `${indentationKey}"${localization.key}": "${replaceMarkers(value, platform)}"`;
            } else {
                const plurals = {[EXPORT_CONFIGURATION.PLURAL_CONFIG.ZERO.KEY]: "zero", [EXPORT_CONFIGURATION.PLURAL_CONFIG.ONE.KEY]: "one", [EXPORT_CONFIGURATION.PLURAL_CONFIG.OTHER.KEY]: "other"};
                exportedString += `${indentationKey}"${localization.key}": "`;
                Object.keys(plurals).forEach((plural: any, index: number) => {
                    const value = localization[language.name][plural];
                    if (value != undefined) {
                        exportedString += `${replaceMarkers(value.replace(/"/g, "\\\""), platform)}`;
                    }
                    if (index < 2) {
                        exportedString += " | ";
                    } else {
                        exportedString += `"`;
                    }
                });
            }

            //Is there data after or not
            if (isInAGroup) {
                if (indexKey < groupObject.localizations.length - 1) {
                    exportedString += `,\n`;
                } else {
                    exportedString += `\n`;
                }
            } else {
                if (indexKey < groupObject.localizations.length - 1 || index < localizedObjects.length - 1) {
                    exportedString += `,\n`;
                } else {
                    exportedString += `\n`;
                }
            }
        });

        //Close group
        if (isInAGroup) {
            if (index === localizedObjects.length - 1) {
                exportedString += `    }\n`;
            } else {
                exportedString += `    },\n`;
            }
        }
    });

    exportedString += "}";
    return {language: language.name.toUpperCase(), content: exportedString};
};

export const generateWebStringFiles = (languages: Array<Language>, localizedObjects: Array<Localizable>) => {
    const answer: any = [];
    languages.forEach((language: Language) => {
        answer.push(generateWebStringFile(EXPORT_CONFIGURATION.PLATFORMS.WEB, language, localizedObjects));
    });
    return answer;
};