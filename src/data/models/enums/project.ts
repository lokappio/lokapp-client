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