import { escapeXMLCharacters } from "../../helpers/escape_XMLCharacters";
import { generateAndroidStringFiles } from "./export_strings_android";
import { generateIOSStringFiles } from "./export_strings_ios";
import Language from "../../models/api/Language";
import { generateWebStringFiles } from "./export_strings_web";
import store from "@/store";
import Project, {LocalizedGroup} from "@/data/models/api/Project";
import {FileData} from "@/data/models/types/export";
import {Platform} from "@/data/models/enums/project";

export const STRING_CONFIGURATION: any = {
    STRING: "s",
    NUMBER: "d",
    NUMBER_PRECISION: "([0-9]{2,})d",
    FLOAT: "f",
    FLOAT_PRECISION: "(.[0-9]{1})f"
};

export const STRING_SPECIFIERS: any = {
    [Platform.ANDROID]: {
        [STRING_CONFIGURATION.STRING]: "s",
        [STRING_CONFIGURATION.NUMBER]: "d",
        [STRING_CONFIGURATION.NUMBER_PRECISION]: "$1d",
        [STRING_CONFIGURATION.FLOAT]: "f",
        [STRING_CONFIGURATION.FLOAT_PRECISION]: "$1f"
    },
    [Platform.IOS]: {
        [STRING_CONFIGURATION.STRING]: "@",
        [STRING_CONFIGURATION.NUMBER]: "d",
        [STRING_CONFIGURATION.NUMBER_PRECISION]: "$1d",
        [STRING_CONFIGURATION.FLOAT]: "f",
        [STRING_CONFIGURATION.FLOAT_PRECISION]: "$1f"
    },
    [Platform.WEB]: {
        [STRING_CONFIGURATION.STRING]: "@",
        [STRING_CONFIGURATION.NUMBER]: "d",
        [STRING_CONFIGURATION.NUMBER_PRECISION]: "$1d",
        [STRING_CONFIGURATION.FLOAT]: "f",
        [STRING_CONFIGURATION.FLOAT_PRECISION]: "$1f"
    }
};

export const replaceMarkers = (str: string, platform: Platform) => {
    const regexp = new RegExp(/(\$\{([.0-9]{0,}[s|d|f]{1})\})/g);
    const replacements = STRING_SPECIFIERS[platform];
    const data = [...str.matchAll(regexp)].reverse();
  
    let output = str;
    data.forEach((match, i) => {
        const markerLength = match[0].length;
        const markerValue = match[2];
        const index = data.length - i;
  
        const markerReplacement = Object.keys(replacements).map(platformMarker => {
            if (markerValue.match(new RegExp(platformMarker))) {
                let replacedMarker = "";

                if (platform === Platform.WEB) {
                    if (markerValue === platformMarker) {
                        replacedMarker = markerValue.replace(platformMarker, replacements[platformMarker]);
                    } else {
                        const myRegExp: any = new RegExp(replacements[platformMarker]);
                        replacedMarker = markerValue.replace(new RegExp("/" + platformMarker + "/"), myRegExp);
                    }
                    return `{var${index}}`;
                }

                if (markerValue === platformMarker) {
                    replacedMarker = markerValue.replace(platformMarker, replacements[platformMarker]);
                } else {
                    const myRegExp: any = new RegExp(replacements[platformMarker]);
                    replacedMarker = markerValue.replace(new RegExp("/" + platformMarker + "/"), myRegExp);
                }
                return `%${index}$` + replacedMarker;
            }
        }).find(v => v);
        
        if (match.index != undefined && match.index >= 0) {
            output = output.substring(0, match.index) + markerReplacement + output.substring(match.index + markerLength, output.length);
        }
    });

    output = escapeXMLCharacters(platform, output);
  
    return output;
}

export const mixGroupAndKeyName = (groupName: string, keyName: string) => {
    return groupName + "_" + keyName;
}

const generateStringFiles = (platform: string, languagesParsed: Language[], localizedObjects: LocalizedGroup[], prefixWithGroup: boolean): FileData[] => {
    switch (platform) {
        case Platform.ANDROID:
            return generateAndroidStringFiles(languagesParsed, localizedObjects, prefixWithGroup);
        case Platform.IOS:
            return generateIOSStringFiles(languagesParsed, localizedObjects, prefixWithGroup);
        case Platform.WEB:
            return generateWebStringFiles(languagesParsed, localizedObjects);
        default:
            break;
    }
}

export const exportProject = (platform: string, prefixWithGroup: boolean): FileData[] => {
    const project: Project = store.getters.currentProject;

    return generateStringFiles(platform, project.languages, project.toLocalizedProject, prefixWithGroup);
};