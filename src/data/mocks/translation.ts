import Key from "@/data/models/api/Key";
import Value, {ValueQuantity} from "@/data/models/api/Value";
import {frLanguage} from "@/data/mocks/language";
import {commonGroup} from "@/data/mocks/group";

/******* VALUES *********/
export const singularValue = Value.map({
  id: 1,
  name: "singulier",
  quantityString: null,
  languageId: frLanguage.id,
  keyId: 1,
});

export const pluralValueZero = Value.map({
  id: 2,
  name: "pluriel_zero",
  quantityString: ValueQuantity.zero,
  languageId: frLanguage.id,
  keyId: 2,
});

export const pluralValueOne = Value.map({
  id: 3,
  name: "pluriel_one",
  quantityString: ValueQuantity.one,
  languageId: frLanguage.id,
  keyId: 2,
});

export const pluralValueOther = Value.map({
  id: 4,
  name: "pluriel_other",
  quantityString: ValueQuantity.other,
  languageId: frLanguage.id,
  keyId: 2,
});

/******* KEYS *********/
const singularKey = Key.map({
  id: 1,
  name: "singular",
  isPlural: false,
  groupId: 1
});
singularKey.values = [singularValue]

const pluralKey = Key.map({
  id: 2,
  name: "plural",
  isPlural: true,
  groupId: 1
});
pluralKey.values = [pluralValueZero, pluralValueOne, pluralValueOther]

export {singularKey, pluralKey};