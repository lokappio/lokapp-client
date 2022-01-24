import {mixGroupAndKeyName, replaceMarkers} from "./export_configuration";
import Language from "../../models/api/Language";
import {LocalizedGroup, Plural} from "@/data/models/api/Project";
import {KeyType, Platform} from "@/data/models/enums/project";
import {FileData} from "@/data/models/types/export";
import xmlFormatter from "xml-formatter";

const generateAndroidStringFile = (language: Language, localizedProject: LocalizedGroup[]): FileData => {
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
                const value = (localization[language.name]?.toString() ?? "").replace(/"/g, "\\\"");

                const stringEl = xmlDoc.createElement("string");
                stringEl.setAttribute("name", mixGroupAndKeyName(localizedGroup.name, localization.key));
                stringEl.innerHTML = replaceMarkers(value, platform);
                resourcesEl.appendChild(stringEl);
            } else {
                const pluralEl = xmlDoc.createElement("plural");
                pluralEl.setAttribute("name", mixGroupAndKeyName(localizedGroup.name, localization.key));

                const value: Plural = (localization[language.name] as Plural) ?? new Plural();

                Object.entries(value).forEach((value) => {
                    if (value !== undefined) {
                        const itemEl = xmlDoc.createElement("item");
                        itemEl.setAttribute("quantity", value[0]);
                        itemEl.innerHTML = replaceMarkers(value[1].replace(/"/g, "\\\""), platform);
                        pluralEl.appendChild(itemEl);
                    }
                });

                resourcesEl.appendChild(pluralEl);
            }
        });
    });

    xmlDoc.appendChild(resourcesEl);
    return {language: language.name.toUpperCase(), content: xmlFormatter(new XMLSerializer().serializeToString(xmlDoc), {collapseContent: true})};
};

export const generateAndroidStringFiles = (languages: Array<Language>, localizedObjects: LocalizedGroup[]): FileData[] => {
    return languages.map((language: Language) => generateAndroidStringFile(language, localizedObjects));
};