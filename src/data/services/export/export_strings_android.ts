import { mixGroupAndKeyName, replaceMarkers } from "./export_configuration";
import Language from "../../models/api/Language";
import { LocalizedGroup, Plural } from "@/data/models/api/Project";
import { KeyType, Platform } from "@/data/models/enums/project";
import { FileData } from "@/data/models/types/export";
import xmlFormatter from "xml-formatter";

const generateAndroidStringFile = (language: Language, localizedProject: LocalizedGroup[], prefixWithGroup: boolean): FileData => {
    const platform = Platform.ANDROID;

    const xmlDoc = document.implementation.createDocument("", "", null);
    const resourcesEl = xmlDoc.createElement("resources");

    localizedProject.forEach((localizedGroup) => {
        if (localizedGroup.name != null) {
            const commentEl = xmlDoc.createComment(localizedGroup.name);
            resourcesEl.appendChild(commentEl);
        }

        localizedGroup.localizations.forEach((localization) => {
            if (localization.type === KeyType.SINGULAR) {
                const value = (localization[language.id]?.toString() ?? "")
                  .replace(/"/g, "\\\"")
                  .replace(/'/g, '\\\'')
                  .replace(/%/g, '%%');
                const stringEl = xmlDoc.createElement("string");
                const key = prefixWithGroup ? mixGroupAndKeyName(localizedGroup.name, localization.key) : localization.key;
                stringEl.setAttribute("name", key);
                stringEl.innerHTML = `"${replaceMarkers(value, platform)}"`;
                resourcesEl.appendChild(stringEl);
            } else {
                const pluralEl = xmlDoc.createElement("plurals");
                const key = prefixWithGroup ? mixGroupAndKeyName(localizedGroup.name, localization.key) : localization.key;
                pluralEl.setAttribute("name", key);

                const value: Plural = (localization[language.id] as Plural) ?? new Plural();

                Object.entries(value).forEach((value) => {
                    if (value !== undefined) {
                        const itemEl = xmlDoc.createElement("item");
                        itemEl.setAttribute("quantity", value[0]);
                        itemEl.innerHTML = `"${replaceMarkers(value[1].replace(/"/g, "\\\"").replace(/'/g, '\\\'').replace(/%/g, '%%'), platform)}"`;
                        pluralEl.appendChild(itemEl);
                    }
                });

                resourcesEl.appendChild(pluralEl);
            }
        });
    });

    xmlDoc.appendChild(resourcesEl);
    return { language: language.name.toLowerCase(), content: xmlFormatter(new XMLSerializer().serializeToString(xmlDoc), { collapseContent: true }) };
};

export const generateAndroidStringFiles = (languages: Array<Language>, localizedObjects: LocalizedGroup[], prefixWithGroup: boolean): FileData[] => {
    return languages.map((language: Language) => generateAndroidStringFile(language, localizedObjects, prefixWithGroup));
};