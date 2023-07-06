export enum ValueQuantity {
  zero = "zero", one = "one", other = "other"
}

export default class Value {
  id: number
  name: string
  quantityString: ValueQuantity;
  languageId: number;
  languageName: string;
  keyId: number;

  static map(data: Partial<Value>): Value {
    const value: Value = new Value();

    value.id = data.id;
    value.name = data?.name ?? "";
    value.quantityString = data['quantityString'] != null ? ValueQuantity[data['quantityString']] : null ;
    value.languageId = data['languageId'];
    value.languageName = data['languageName'];
    value.keyId = data['keyId'];

    return value;
  }
}

