export default {
  //IF BUILT FROM DOCKER, process.env IS NULL SO STRINGS ARE APPLIED AND REPLACED BY ENV VARS OF DOCKER-COMPOSE BY .docker/entrypoint.sh FILE
  firebase: {
    apiKey: String(process.env.VUE_APP_FIREBASE_API_KEY ?? 'VUE_APP_FIREBASE_API_KEY_ENV'),
    authDomain: String(process.env.VUE_APP_FIREBASE_AUTH_DOMAIN ?? 'VUE_APP_FIREBASE_AUTH_DOMAIN_ENV'),
    projectId: String(process.env.VUE_APP_FIREBASE_PROJECT_ID ?? 'VUE_APP_FIREBASE_PROJECT_ID_ENV'),
    storageBucket: String(process.env.VUE_APP_FIREBASE_STORAGE_BUCKET ?? 'VUE_APP_FIREBASE_STORAGE_BUCKET_ENV') ,
    messagingSenderId: String(process.env.VUE_APP_FIREBASE_MESSAGINGSENDER_ID ?? 'VUE_APP_FIREBASE_MESSAGINGSENDER_ID_ENV'),
    appId: String(process.env.VUE_APP_FIREBASE_APP_ID ?? 'VUE_APP_FIREBASE_APP_ID_ENV'),
    measurementId: String(process.env.VUE_APP_FIREBASE_MEASUREMENT_ID ?? 'VUE_APP_FIREBASE_MEASUREMENT_ID'),
  },
  locale: String(process.env.VUE_APP_I18N_FALLBACK_LOCALE ?? 'VUE_APP_I18N_FALLBACK_LOCALE_ENV'),
  baseUrl: String(process.env.VUE_APP_BASE_URL ?? 'VUE_APP_BASE_URL_ENV')
};