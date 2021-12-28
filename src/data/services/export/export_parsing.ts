import { EXPORT_CONFIGURATION } from "./export_configuration";
import Group from "../../models/export/Group";
import Key from "../../models/export/Key";
import Language from "../../models/export/Language";
import Localizable, { LocalizableKey } from "../../models/export/Localizable";

/*export const getLanguages = (headers: any): Array<Language> => {
    const languages: Array<Language> = [];
    headers.forEach((element: any) => {
        if (element.value != "group" && element.value != "keys") {
            languages.push({
                name: element.text,
                id: parseInt(element.value)
            });
        }
    });
    return languages;
};*/

export const getGroups = (groups: any): Array<Group> => {
    const groupsParsed: Array<Group> = [];
    groups.forEach((element: any) => {
        if (element.groupId != null) {
            groupsParsed.push({
                id: element.groupId,
                name: element.groupName
            });
        } else {
            groupsParsed.push({
                id: null,
                name: null
            });
        }
    });
    return groupsParsed;
};

export const getKeys = (items: any, parsedLanguages: Array<Language>): Array<Key> => {
    const keysParsed: Array<Key> = [];
    items.forEach((item: any) => {
        const values: {[languageName: string]: string} = {};
        parsedLanguages.forEach((language: Language) => {
            if (item[language.id.toString()] === null) {
                values[language.name] = "";
            } else {
                values[language.name] = item[language.id.toString()];
            }
        });
        keysParsed.push({
            name: item.keys,
            groupId: item.groupId,
            isPlural: item.isPlural,
            quantity: item.quantity,
            values: values
        });
    });
    return keysParsed;
};

export const getLocalizationsObjects = (languages: Array<Language>, groups: Array<Group>, keys: Array<Key>): Array<Localizable> => {
    const localizationsBlocks: Array<Localizable> = [];

    groups.forEach((group) => {
        //Create one group
        const groupParsed: Localizable = {
            name: group.name,
            localizations: []
        };

        for (const key of keys) {
            //Add key on actual group
            if (key.groupId != group.id) {
                continue;
            }
        
            if (key.isPlural === false) {
                //If my key is singular
                const keySingular: LocalizableKey = {
                    key: key.name,
                    type: EXPORT_CONFIGURATION.LOCALIZATION_TYPE.SINGULAR
                };
                languages.forEach((language: Language) => {
                    if (key.values[language.name] === "" || key.values[language.name] === null) {
                        keySingular[language.name] = "";
                    } else {
                        keySingular[language.name] = key.values[language.name];
                    }
                });
                groupParsed.localizations.push(keySingular);
            } else {
                
                //If my key is plural
                let existingBlock: LocalizableKey;
                if (groupParsed.localizations.findIndex((obj: LocalizableKey) => obj.key === key.name) === -1) {

                    //If the "localizations" Block doesn't exist on that key, it will be create
                    existingBlock = {
                        key: key.name,
                        type: EXPORT_CONFIGURATION.LOCALIZATION_TYPE.PLURAL
                    };
                    languages.forEach((language: Language) => existingBlock[language.name] = {});
                    groupParsed.localizations.push(existingBlock);
                } else {
                    existingBlock = groupParsed.localizations.find((obj: LocalizableKey) => obj.key === key.name);
                }

                //Add values on for actual plural of key
                languages.forEach((language: Language) => {
                    if (key.quantity === null) {
                        return;
                    }
                    if (key.values[language.name] === "" || key.values[language.name] === null) {
                        (existingBlock[language.name] as {[quantity: string]: string})[key.quantity] = "";
                    } else {
                        (existingBlock[language.name] as {[quantity: string]: string})[key.quantity] = key.values[language.name];
                    }
                });
            }
        }
        localizationsBlocks.push(groupParsed);
    });
    return localizationsBlocks;
};