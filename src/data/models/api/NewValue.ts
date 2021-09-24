export default class NewValue {
  id: number
  name: string
  quantityString: string;
  languageId: number;
  keyId: number;

  static map(data: Partial<NewValue>): NewValue {
    const value: NewValue = new NewValue();

    value.id = data.id;
    value.name = data.name;
    value.quantityString = data['quantity_string'];
    value.languageId = data['language_id'];
    value.keyId = data['key_id'];

    return value;
  }
}