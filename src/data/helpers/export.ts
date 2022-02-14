import JSZip from "jszip";
import { saveAs } from 'file-saver';
import {TranslationFile} from "@/data/models/types/export";
import store from "@/store";

export default class Export {
  static downloadFile(content: string, name: string): void {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', name);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  static downloadEverything(files: TranslationFile[], platform: string): void {
    const zip = new JSZip();
    files.forEach((file) => {
      zip.file(file.name, file.content);
    });
    zip.generateAsync({type: "blob"})
      .then((content) => {
        saveAs(content, `${platform.toLowerCase()}-${store.getters.currentProject.name.replaceAll(" ", "_")}-lokapp.zip`);
      });
  }
}