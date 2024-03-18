import Value, {ValueQuantity} from "@/data/models/api/Value";
import Key from "@/data/models/api/Key";
import Group from "@/data/models/api/Group";

export type TranslationItem = {key: Key; group: Group; quantity?: ValueQuantity; languages: {[language: string]: Value}};

export type TranslationGroup = Partial<Group>;