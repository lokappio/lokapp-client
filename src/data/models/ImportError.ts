export default class ImportError {
  reason: string;
  color: string;

  constructor(reason: string, color = "red", description = "") {
    this.reason = reason;
    this.color = color;
  }
}