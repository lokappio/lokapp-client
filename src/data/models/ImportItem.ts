export default class ImportItem {
  language: string;
  content: File;

  get extension(): string { return this.content.name.split(".").pop(); }

  constructor(language: string, content: File) {
    this.language = language;
    this.content = content;
  }
}