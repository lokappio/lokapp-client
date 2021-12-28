import {mixGroupAndKeyName, replaceMarkers} from "./export_configuration";
import Language from "../../models/api/Language";
import {LocalizedGroup, Plural} from "@/data/models/api/Project";
import {KeyType, Platform} from "@/data/models/enums/project";
import {FileData} from "@/data/models/types/export";

const generateAndroidStringFile = (language: Language, localizedProject: LocalizedGroup[]): FileData => {
    const platform = Platform.ANDROID;

    let exportedString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<resources>\n";

    localizedProject.forEach((localizedGroup, index) => {
        if (index > 0) {
            exportedString += "\n";
        }
        if (localizedGroup.name != null) {
            exportedString += `    <!-- ${localizedGroup.name} -->\n`;
        }

        localizedGroup.localizations.forEach((localization) => {
            if (localization.type === KeyType.SINGULAR) {
                const value = localization[language.name].toString().replace(/"/g, "\\\"");
                exportedString += `    <string name="${mixGroupAndKeyName(localizedGroup.name, localization.key)}">"${replaceMarkers(value, platform)}"</string>\n`;
            } else {
                exportedString += `    <plurals name="${mixGroupAndKeyName(localizedGroup.name, localization.key)}">\n`;
                const value: Plural = localization[language.name] as Plural;

                Object.entries(value).forEach((value) => {
                    if (value !== undefined) {
                        exportedString += `        <item quantity="${value[0]}">"${replaceMarkers(value[1].replace(/"/g, "\\\""), platform)}"</item>\n`;
                    }
                });

                exportedString += `    </plurals>\n`;
            }

        });
        
    });    

    exportedString += "</resources>";
    return {language: language.name.toUpperCase(), content: exportedString};
};

export const generateAndroidStringFiles = (languages: Array<Language>, localizedObjects: LocalizedGroup[]): FileData[] => {
    return languages.map((language: Language) => generateAndroidStringFile(language, localizedObjects));
};