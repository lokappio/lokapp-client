import NewValue from "@/data/models/api/NewValue";
import NewKey from "@/data/models/api/NewKey";
import NewGroup from "@/data/models/api/NewGroup";

export type translationItem = {[language: string]: NewValue; key: NewKey; group: NewGroup};