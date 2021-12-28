import { EXPORT_CONFIGURATION, mixGroupAndKeyName, replaceMarkers } from "./export_configuration";
import Language from "../../models/export/Language";
import Localizable from "../../models/export/Localizable";

const generateAndroidStringFile = (language: Language, localizedObjects: Array<Localizable>) => {
    const platform = EXPORT_CONFIGURATION.PLATFORMS.ANDROID;

    let exportedString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n\
<resources>\n";

    localizedObjects.forEach((groupObject: Localizable, index: number) => {

        if (index > 0) {
            exportedString += "\n";
        }
        if (groupObject.name != null) {
            exportedString += `    <!-- ${groupObject.name} -->\n`;
        }

        groupObject.localizations.forEach((localization: any) => {

            if (localization.type === EXPORT_CONFIGURATION.LOCALIZATION_TYPE.SINGULAR) {
                const value = localization[language.name].toString().replace(/"/g, "\\\"");
                exportedString += `    <string name="${mixGroupAndKeyName(groupObject.name, localization.key)}">"${replaceMarkers(value, platform)}"</string>\n`;
            } else {
                exportedString += `    <plurals name="${mixGroupAndKeyName(groupObject.name, localization.key)}">\n`;

                const plurals = {[EXPORT_CONFIGURATION.PLURAL_CONFIG.ZERO.KEY]: "zero", [EXPORT_CONFIGURATION.PLURAL_CONFIG.ONE.KEY]: "one", [EXPORT_CONFIGURATION.PLURAL_CONFIG.OTHER.KEY]: "other"};
                Object.keys(plurals).forEach((plural: any) => {
                    const value = localization[language.name][plural];
                    if (value !== undefined) {
                        exportedString += `        <item quantity="${plurals[plural]}">"${replaceMarkers(value.replace(/"/g, "\\\""), platform)}"</item>\n`;
                    }
                });

                exportedString += `    </plurals>\n`;
            }

        });
        
    });    

    exportedString += "</resources>";
    return {language: language.name.toUpperCase(), content: exportedString};
};

export const generateAndroidStringFiles = (languages: Array<Language>, localizedObjects: Array<Localizable>) => {
    const answer: any = [];
    languages.forEach((language: Language) => {
        answer.push(generateAndroidStringFile(language, localizedObjects));
    });
    return answer;
};