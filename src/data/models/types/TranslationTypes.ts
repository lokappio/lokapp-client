import Value, {ValueQuantity} from "@/data/models/api/Value";
import Key from "@/data/models/api/Key";
import Group from "@/data/models/api/Group";

export type translationItem = {key: Key; group: Group; quantity?: ValueQuantity; [language: string]: Value};

export type translationGroup = Partial<Group>;