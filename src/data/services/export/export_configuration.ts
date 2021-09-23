import { escapeXMLCharacters } from "../../helpers/escape_XMLCharacters";
import { getGroups, getKeys, getLanguages, getLocalizationsObjects } from "./export_parsing";
import { generateAndroidStringFiles } from "./export_strings_android";
import { generateIOSStringFiles } from "./export_strings_ios";
import Group from "../../models/export/Group";
import Key from "../../models/export/Key";
import Language from "../../models/export/Language";
import Localizable from "../../models/export/Localizable";
import { generateWebStringFiles } from "./export_strings_web";

export const EXPORT_CONFIGURATION: any = {

    PLATFORMS : {
        ANDROID: "Android",
        IOS: "iOS",
        WEB: "Web"
    },
    LOCALIZATION_TYPE : {
        SINGULAR: "singular",
        PLURAL: "plural"
    },
    PLURAL_CONFIG : {
        ZERO: {
            PATTERN: "[zero]",
            KEY: "zero"
        },
        ONE: {
            PATTERN: "[one]",
            KEY: "one"
        },
        OTHER: {
            PATTERN: "[other]",
            KEY: "other"
        }
    },
};

export const STRING_CONFIGURATION: any = {
    STRING: "s",
    NUMBER: "d",
    NUMBER_PRECISION: "([0-9]{2,})d",
    FLOAT: "f",
    FLOAT_PRECISION: "(.[0-9]{1})f"
};

export const STRING_SPECIFIERS: any = {
    [EXPORT_CONFIGURATION.PLATFORMS.ANDROID]: {
        [STRING_CONFIGURATION.STRING]: "s",
        [STRING_CONFIGURATION.NUMBER]: "d",
        [STRING_CONFIGURATION.NUMBER_PRECISION]: "$1d",
        [STRING_CONFIGURATION.FLOAT]: "f",
        [STRING_CONFIGURATION.FLOAT_PRECISION]: "$1f"
    },
    [EXPORT_CONFIGURATION.PLATFORMS.IOS]: {
        [STRING_CONFIGURATION.STRING]: "@",
        [STRING_CONFIGURATION.NUMBER]: "d",
        [STRING_CONFIGURATION.NUMBER_PRECISION]: "$1d",
        [STRING_CONFIGURATION.FLOAT]: "f",
        [STRING_CONFIGURATION.FLOAT_PRECISION]: "$1f"
    },
    [EXPORT_CONFIGURATION.PLATFORMS.WEB]: {
        [STRING_CONFIGURATION.STRING]: "@",
        [STRING_CONFIGURATION.NUMBER]: "d",
        [STRING_CONFIGURATION.NUMBER_PRECISION]: "$1d",
        [STRING_CONFIGURATION.FLOAT]: "f",
        [STRING_CONFIGURATION.FLOAT_PRECISION]: "$1f"
    }
};

export const replaceMarkers = (str: string, platform: any) => {
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

                if (platform === EXPORT_CONFIGURATION.PLATFORMS.WEB) {
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

const generateStringFiles = (platform: any, languagesParsed: any, localizedObjects: any) => {
    switch (platform) {
        case EXPORT_CONFIGURATION.PLATFORMS.ANDROID:
            return generateAndroidStringFiles(languagesParsed, localizedObjects);
        case EXPORT_CONFIGURATION.PLATFORMS.IOS:
            return generateIOSStringFiles(languagesParsed, localizedObjects);
        case EXPORT_CONFIGURATION.PLATFORMS.WEB:
            return generateWebStringFiles(languagesParsed, localizedObjects);
        default:
            break;
    }
}

const sortObjects = (localizationsObjects: any) => {

    //Sort groups by alphabetical order
    localizationsObjects.sort((first: any, second: any) => {
        //Null group first
        if (first.name === null) {
            return -1;
        }
        if (second.name === null) {
            return 1;
        }
        return (first.name.localeCompare(second.name));
    });

    //Sort keys by alphabetical order
    localizationsObjects.forEach((group: any) => {
        group.localizations.sort((first: any, second: any) => {
            return (first.key.localeCompare(second.key));
        });
    });
};

export const exportProject = (platform: string, headers: any, items: any, groups: any) => {

    //Generate common object to manipulate data
    const languagesParsed: Array<Language> = getLanguages(headers);
    const groupsParsed: Array<Group> = getGroups(groups);
    const keysParsed: Array<Key> = getKeys(items, languagesParsed);
    const localizationsObjects: Array<Localizable> = getLocalizationsObjects(languagesParsed, groupsParsed, keysParsed);
    sortObjects(localizationsObjects);

    return generateStringFiles(platform, languagesParsed, localizationsObjects);
};