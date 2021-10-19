export enum ValueQuantity {
  zero = "zero", one = "one", other = "other"
}

export default class NewValue {
  id: number
  name: string
  quantityString: ValueQuantity;
  languageId: number;
  keyId: number;

  static map(data: Partial<NewValue>): NewValue {
    const value: NewValue = new NewValue();

    value.id = data.id;
    value.name = data.name;
    value.quantityString = data['quantity_string'] != null ? ValueQuantity[data['quantity_string']] : null ;
    value.languageId = data['language_id'];
    value.keyId = data['key_id'];

    return value;
  }
}

