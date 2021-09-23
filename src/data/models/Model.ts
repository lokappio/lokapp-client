export default class Model {
  property: any

  constructor(property: string) {
    this.property = property
  }

  public static map(json: any): Model {
    return new this(json.property)
  }
}
