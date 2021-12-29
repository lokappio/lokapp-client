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
    value.quantityString = data['quantity_string'] != null ? ValueQuantity[data['quantity_string']] : null ;
    value.languageId = data['language_id'];
    value.languageName = data['language_name'];
    value.keyId = data['key_id'];

    return value;
  }
}

