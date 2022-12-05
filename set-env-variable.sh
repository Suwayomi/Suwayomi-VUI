#!/bin/sh
JSON_STRING='window.configs = { \
  "TachideskURL":"'"${TachideskURL}"'", \
  "VUE_APP_VAR2":"'"${VUE_APP_VAR2}"'" \
}'
sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /usr/share/nginx/html/index.html
exec "$@"
