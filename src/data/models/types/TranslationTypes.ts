import NewValue, {ValueQuantity} from "@/data/models/api/NewValue";
import NewKey from "@/data/models/api/NewKey";
import NewGroup from "@/data/models/api/NewGroup";

export type translationItem = {key: NewKey; group: NewGroup; quantity: ValueQuantity; [language: string]: NewValue};