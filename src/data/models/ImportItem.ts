export class ItemIOS {
  extension: string;
  content: string

  constructor(extension: string, content: string) {
    this.extension = extension;
    this.content = content;
  }
}

export default class ImportItem {
  language: string;
  content: File[] | File | string | ItemIOS[];
  fromTest: boolean;

  constructor(language: string, content: File[] | File | string | ItemIOS[], fromTest = false) {
    this.language = language;
    this.content = content;
    this.fromTest = fromTest;
  }
}