export enum ValueQuantity {
  zero = "zero", one = "one", other = "other"
}

export type partialValue = Partial<Value> &
  {
    'quantity_string'?: ValueQuantity;
    'language_id'?: number;
    'key_id'?: number;
  };

export default class Value {
  id: number
  name: string
  quantityString: ValueQuantity;
  languageId: number;
  keyId: number;


  static map(data: partialValue): Value {
    const value: Value = new Value();

    value.id = data.id;
    value.name = data?.name ?? "";
    value.quantityString = data['quantity_string'] != null ? ValueQuantity[data['quantity_string']] : null ;
    value.languageId = data['language_id'];
    value.keyId = data['key_id'];

    return value;
  }
}

