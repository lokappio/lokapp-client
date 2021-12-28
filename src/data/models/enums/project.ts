export enum KeyType {
  SINGULAR="singular", PLURAL="plural"
}

export enum KeyTypeValues {
  ONE="one", ZERO="zero", OTHER="other"
}
export namespace KeyTypeValues {
  export function toIOS(keyType: KeyTypeValues): string {
    switch (keyType) {
      case KeyTypeValues.ONE:
        return '[one]';
      case KeyTypeValues.ZERO:
        return '[zero]';
      case KeyTypeValues.OTHER:
        return '[other]'

    }
  }
}

export enum Platform {
  ANDROID="android", IOS="ios", WEB="web"
}