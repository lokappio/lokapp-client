import { replaceMarkers, mixGroupAndKeyName } from "./export_configuration";
import Language from "../../models/export/Language";
import {LocalizedGroup, Plural} from "@/data/models/api/Project";
import {KeyType, Platform} from "@/data/models/enums/project";
import {FileData} from "@/data/models/types/export";

const generateIOSStringDictFile = (language: Language, localizedProject: LocalizedGroup[]): FileData => {
    const platform = Platform.IOS;

    let exportedString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n\
<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n\
<plist version=\"1.0\">\n\
<dict>\n";

        localizedProject.forEach((localizedGroup) => {

            if (localizedGroup.localizations.find((localization) => localization.type === KeyType.PLURAL)) {
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

                const values: Plural = localization[language.name] as Plural;
                Object.entries(values).forEach((value) => {
                    exportedString += "            <key>" + value[0] + "</key>\n";
                    exportedString += "            <string>" + replaceMarkers(value[1], platform).replace(/"/g, "\\\"") + "</string>\n";

                });

                exportedString += "        </dict>\n";
                exportedString += "    </dict>\n";
            });
        });

    exportedString += "</dict>\n";
    exportedString += "</plist>\n";
    exportedString += "\n";

    return {language: language.name.toUpperCase(), content: exportedString, plural: true};
};

const generateIOSStringFile = (language: Language, localizedProject: LocalizedGroup[]): FileData => {
    const platform = Platform.IOS;
    let exportedString = "";

    localizedProject.forEach((localizedGroup) => {
        exportedString += "\n";

        if (localizedGroup.name != null) {
            exportedString += "// MARK: - " + localizedGroup.name + "\n\n";
        }

        localizedGroup.localizations
          .filter((localization) => localization.type === KeyType.SINGULAR)
          .forEach((localization) => {
              const value = localization[language.name].toString().replace(/"/g, "\\\"");
              exportedString += `"${mixGroupAndKeyName(localizedGroup.name, localization.key)}" = "${replaceMarkers(value, platform)}";\n`;
          });
    });
    return {language: language.name.toUpperCase(), content: exportedString, plural: false};
};

export const generateIOSStringFiles = (languages: Array<Language>, localizedObjects: LocalizedGroup[]): FileData[] => {
    const answer: any = [];
    languages.forEach((language: Language) => {
        answer.push(generateIOSStringFile(language, localizedObjects));
        answer.push(generateIOSStringDictFile(language, localizedObjects));
    });
    return answer;
}