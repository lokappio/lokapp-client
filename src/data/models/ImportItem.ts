export default class ImportItem {
  language: string;
  content: File[] | File | string;

  constructor(language: string, content: File[] | File | string) {
    this.language = language;
    this.content = content;
  }
}