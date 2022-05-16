export default class ImportError {
  reason: string;
  color: string;

  constructor(reason: string, color = "red") {
    this.reason = reason;
    this.color = color;
  }

  static fromJson(json: Partial<ImportError>): ImportError {
    return new ImportError(json.reason, json.color);
  }
}