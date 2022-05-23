export default class ImportItem {
  language: string;
  content: File[];

  constructor(language: string, content: File[]) {
    this.language = language;
    this.content = content;
  }
}