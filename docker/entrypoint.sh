#!/bin/sh

ROOT_DIR=/usr/share/nginx/html

echo "Replacing env constants in JS"
ls $ROOT_DIR/js

for file in $ROOT_DIR/js/app.*.js*;
do
  echo "Processing $file ...";

  sed -i 's|VUE_APP_I18N_FALLBACK_LOCALE_ENV|'${VUE_APP_I18N_FALLBACK_LOCALE}'|g' $file
  sed -i 's|VUE_APP_BASE_URL_ENV|'${VUE_APP_BASE_URL}'|g' $file
  sed -i 's|VUE_APP_FIREBASE_API_KEY_ENV|'${VUE_APP_FIREBASE_API_KEY}'|g' $file
  sed -i 's|VUE_APP_FIREBASE_AUTH_DOMAIN_ENV|'${VUE_APP_FIREBASE_AUTH_DOMAIN}'|g' $file
  sed -i 's|VUE_APP_FIREBASE_PROJECT_ID_ENV|'${VUE_APP_FIREBASE_PROJECT_ID}'|g' $file
  sed -i 's|VUE_APP_FIREBASE_STORAGE_BUCKET_ENV|'${VUE_APP_FIREBASE_STORAGE_BUCKET}'|g' $file
  sed -i 's|VUE_APP_FIREBASE_MESSAGINGSENDER_ID_ENV|'${VUE_APP_FIREBASE_MESSAGINGSENDER_ID}'|g' $file
  sed -i 's|VUE_APP_FIREBASE_APP_ID_ENV|'${VUE_APP_FIREBASE_APP_ID}'|g' $file
  sed -i 's|VUE_APP_FIREBASE_MEASUREMENT_ID|'${VUE_APP_FIREBASE_MEASUREMENT_ID}'|g' $file

  echo "***************************************************************"
  cat $file;
  echo "\n ***************************************************************"


done

nginx -g "daemon off;"