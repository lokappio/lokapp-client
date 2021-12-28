import { EXPORT_CONFIGURATION, replaceMarkers, mixGroupAndKeyName } from "./export_configuration";
import Language from "../../models/export/Language";
import {LocalizedGroup, Plural} from "@/data/models/api/Project";
import {KeyType} from "@/data/models/enums/project";

const generateIOSStringDictFile = (language: Language, localizedProject: LocalizedGroup[]) => {
    const platform = EXPORT_CONFIGURATION.PLATFORMS.IOS;

    let exportedString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n\
<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n\
<plist version=\"1.0\">\n\
<dict>\n";

        localizedProject.forEach((localizedGroup) => {

            if (localizedGroup.localizations.find((localization) => localization.type === EXPORT_CONFIGURATION.LOCALIZATION_TYPE.PLURAL)) {
                exportedString += `    <!-- MARK: ${localizedGroup.name} -->\n`;
            }

            localizedGroup.localizations
            .filter((localization) => localization.type === KeyType.PLURAL)
            .forEach((localization) => {
                exportedString += "    <key>" + mixGroupAndKeyName(localizedGroup.name, localization.key) + "</key>\n";
                exportedString += "    <dict>\n";
                exportedString += "        <key>NSStringLocalizedFormatKey</key>\n";
                exportedString += "        <string>%#@variable_name@</string>\n";
                exportedString += "        <key>variable_name</key>\n";
                exportedString += "        <dict>\n";
                exportedString += "            <key>NSStringFormatSpecTypeKey</key>\n";
                exportedString += "            <string>NSStringPluralRuleType</string>\n";
                exportedString += "            <key>NSStringFormatValueTypeKey</key>\n";
                exportedString += "            <string>d</string>\n";

                const value: Plural = localization[language.name] as Plural;
                Object.entries(value).forEach((value) => {

                }

                for (const key in EXPORT_CONFIGURATION.PLURAL_CONFIG) {
                    const quantity = EXPORT_CONFIGURATION.PLURAL_CONFIG[key].KEY;
                    if (localization[language.name][quantity]) {
                        exportedString += "            <key>" + quantity + "</key>\n";
                        exportedString += "            <string>" + replaceMarkers(localization[language.name][quantity], platform).replace(/"/g, "\\\"") + "</string>\n";
                    }
                }

                exportedString += "        </dict>\n";
                exportedString += "    </dict>\n";
            });
        });

    exportedString += "</dict>\n";
    exportedString += "</plist>\n";
    exportedString += "\n";

    return {language: language.name.toUpperCase(), content: exportedString, plural: true};
};

const generateIOSStringFile = (language: Language, localizedObjects: LocalizedGroup[]) => {
    let exportedString = "";
    const platform = EXPORT_CONFIGURATION.PLATFORMS.IOS;

    localizedObjects.forEach((groupObject, index) => {
        //Check if data in group
        const indexOfFirst = groupObject.localizations.findIndex((localization: any) => localization.type === EXPORT_CONFIGURATION.LOCALIZATION_TYPE.SINGULAR);
        if (indexOfFirst === -1) {
            return;
        }
        //Write data
        if (index > 0) {
            exportedString += "\n";
        }
        if (groupObject.name != null) {
            exportedString += "// MARK: - " + groupObject.name + "\n\n";
        }
        groupObject.localizations.forEach((localization: any) => {
            if (localization.type !== EXPORT_CONFIGURATION.LOCALIZATION_TYPE.PLURAL) {
                const value = localization[language.name].toString().replace(/"/g, "\\\"");
                exportedString += `"${mixGroupAndKeyName(groupObject.name, localization.key)}" = "${replaceMarkers(value, platform)}";\n`;
            }
        });
    });
    return {language: language.name.toUpperCase(), content: exportedString, plural: false};
};

export const generateIOSStringFiles = (languages: Array<Language>, localizedObjects: LocalizedGroup[]) => {
    const answer: any = [];
    languages.forEach((language: Language) => {
        answer.push(generateIOSStringFile(language, localizedObjects));
        answer.push(generateIOSStringDictFile(language, localizedObjects));
    });
    return answer;
}