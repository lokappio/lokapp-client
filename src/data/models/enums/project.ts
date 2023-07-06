import i18n from "@/i18n";

export enum KeyType {
  SINGULAR="singular", PLURAL="plural"
}

export enum Platform {
  ANDROID="Android", IOS="iOS", WEB="Web"
}

export const PlatformExtension = (platform: Platform) => {
  switch (platform) {
    case Platform.ANDROID:
      return ".xml";
    case Platform.IOS:
      return ".strings, .stringsdict";
    case Platform.WEB:
      return ".json";
  }
}

export const PlatformFileExpected = (platform: Platform): string[] => {
  switch (platform) {
    case Platform.ANDROID:
      return [i18n.t("imports.xml_file_expected").toString()];
    case Platform.IOS:
      return [i18n.t("imports.strings_file_expected").toString(), i18n.t("imports.stringsdict_file_expected").toString()];
    case Platform.WEB:
      return [i18n.t("imports.json_expected_content").toString()];
  }
}