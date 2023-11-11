#!/bin/sh
# # if i need to add UI env variables in the future
# JSON_STRING='window.configs = { \
#   "APP_VAR":"'"${APP_VAR}"'" \
# }'
# sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /usr/share/nginx/html/index.html
# exec "$@"

TMP=$(echo "$tachidesk" | sed "s@/\$@@")
sed -i "s@PLACEHOLDER@$TMP@" /etc/nginx/conf.d/default.conf