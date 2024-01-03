export enum ValueQuantity {
  zero = "zero", one = "one", other = "other"
}

export enum LanguageAccess {
  all = "all",
  source = "source",
  target = "target"
}

export enum TranslationStatus {
  MODIFIED = "modified",
  VALIDATED = "validated",
  INVALIDATED = "invalidated"
}

export default class Value {
  id: number
  name: string
  quantityString: ValueQuantity;
  languageId: number;
  languageName: string;
  languageAccess: LanguageAccess;
  keyId: number;
  updatedAt: Date;
  status: TranslationStatus;

  public static map(data: Partial<Value>): Value {
    const value: Value = new Value();

    value.id = data.id;
    value.name = data?.name ?? "";
    value.quantityString = data['quantityString'] != null ? ValueQuantity[data['quantityString']] : null ;
    value.languageId = data['languageId'];
    value.languageName = data['languageName'];
    value.languageAccess = data['languageAccess'];
    value.keyId = data['keyId'];
    value.updatedAt = new Date(data['updatedAt']);
    value.status = data['status'];

    return value;
  }
}
