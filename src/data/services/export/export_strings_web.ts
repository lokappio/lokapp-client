import Language from "@/data/models/export/Language";
import { EXPORT_CONFIGURATION, replaceMarkers } from "./export_configuration";
import {LocalizedGroup, Plural} from "@/data/models/api/Project";
import {FileData} from "@/data/models/types/export";
import {KeyType} from "@/data/models/enums/project";

const generateWebStringFile = (language: Language, localizedProject: LocalizedGroup[]): FileData => {
    let exportedString = `{\n`;
    const platform = EXPORT_CONFIGURATION.PLATFORMS.WEB;

    localizedProject.forEach((localizedGroup, index) => {
        //Check if some keys inside group
        if (localizedGroup.localizations.length === 0) {
            return;
        }

        let indentationKey = "    ";
        let isInAGroup = false;

        //Group without name = key at root of json
        if (localizedGroup.name != null) {
            indentationKey = "        ";
            isInAGroup = true;
            exportedString += `    "${localizedGroup.name}": {\n`;
        }

        localizedGroup.localizations.forEach((localization: any, indexKey: number) => {
            if (localization.type === KeyType.SINGULAR) {
                const value = localization[language.name].toString().replace(/"/g, "\\\"");
                exportedString += `${indentationKey}"${localization.key}": "${replaceMarkers(value, platform)}"`;
            } else {
                exportedString += `${indentationKey}"${localization.key}": "`;
                const values: Plural = localization[language.name] as Plural;

                Object.entries(values).forEach((value, index) => {
                    exportedString += `${replaceMarkers(value[1].replace(/"/g, "\\\""), platform)}`;
                    if (index < 2) {
                        exportedString += " | ";
                    } else {
                        exportedString += `"`;
                    }
                });
            }

            //Is there data after or not
            if (isInAGroup) {
                if (indexKey < localizedGroup.localizations.length - 1) {
                    exportedString += `,\n`;
                } else {
                    exportedString += `\n`;
                }
            } else {
                if (indexKey < localizedGroup.localizations.length - 1 || index < localizedProject.length - 1) {
                    exportedString += `,\n`;
                } else {
                    exportedString += `\n`;
                }
            }
        });

        //Close group
        if (isInAGroup) {
            if (index === localizedProject.length - 1) {
                exportedString += `    }\n`;
            } else {
                exportedString += `    },\n`;
            }
        }
    });

    exportedString += "}";
    return {language: language.name.toUpperCase(), content: exportedString};
};

export const generateWebStringFiles = (languages: Array<Language>, localizedObjects: LocalizedGroup[]): FileData[] => {
    return languages.map((language: Language) => generateWebStringFile(language, localizedObjects));
};