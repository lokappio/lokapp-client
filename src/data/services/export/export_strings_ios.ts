import { EXPORT_CONFIGURATION, replaceMarkers, mixGroupAndKeyName } from "./export_configuration";
import Language from "../../models/export/Language";
import Localizable from "../../models/export/Localizable";

const generateIOSStringDictFile = (platform: any, language: Language, localizedObjects: Array<Localizable>) => {
    let exportedString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n\
<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n\
<plist version=\"1.0\">\n\
<dict>\n";

    let i = 0;
    for (; i < localizedObjects.length; i++) {
        const item = localizedObjects[i];
        if (item.localizations.find((localization: any) => localization.type === EXPORT_CONFIGURATION.LOCALIZATION_TYPE.PLURAL)) {
            exportedString += `    <!-- MARK: ${item.name} -->\n`;
        }

        item.localizations
        .filter((localization: any) => localization.type === EXPORT_CONFIGURATION.LOCALIZATION_TYPE.PLURAL)
        .forEach((localization: any) => {
            exportedString += "    <key>" + mixGroupAndKeyName(item.name, localization.key) + "</key>\n";
            exportedString += "    <dict>\n";
            exportedString += "        <key>NSStringLocalizedFormatKey</key>\n";
            exportedString += "        <string>%#@variable_name@</string>\n";
            exportedString += "        <key>variable_name</key>\n";
            exportedString += "        <dict>\n";
            exportedString += "            <key>NSStringFormatSpecTypeKey</key>\n";
            exportedString += "            <string>NSStringPluralRuleType</string>\n";
            exportedString += "            <key>NSStringFormatValueTypeKey</key>\n";
            exportedString += "            <string>d</string>\n";

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
    }
    exportedString += "</dict>\n";
    exportedString += "</plist>\n";

    if (i < localizedObjects.length - 1) {
        exportedString += "\n";
    }

    return {language: language.name.toUpperCase(), content: exportedString, plural: true};
};

const generateIOSStringFile = (platform: any, language: Language, localizedObjects: Array<Localizable>) => {
    let exportedString = "";

    localizedObjects.forEach((groupObject: any, index: number) => {
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

export const generateIOSStringFiles = (languages: Array<Language>, localizedObjects: Array<Localizable>) => {
    const answer: any = [];
    languages.forEach((language: Language) => {
        answer.push(generateIOSStringFile(EXPORT_CONFIGURATION.PLATFORMS.IOS, language, localizedObjects));
        answer.push(generateIOSStringDictFile(EXPORT_CONFIGURATION.PLATFORMS.IOS, language, localizedObjects));
    });
    return answer;
}