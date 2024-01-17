#!/bin/sh
# # if i need to add UI env variables in the future
# JSON_STRING='window.configs = { \
#   "APP_VAR":"'"${APP_VAR}"'" \
# }'
# sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /usr/share/nginx/html/index.html
# exec "$@"

TMP=$(echo "$suwayomi" | sed "s@/\$@@")
TMP2=$(awk 'BEGIN{ORS=" "} $1=="nameserver" {print $2}' /etc/resolv.conf)
regex='^([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4}$'
if [[ $TMP2 =~ $regex ]]; then
  sed -i "s@resolverPLACEHOLDER@[$TMP2]@" /etc/nginx/conf.d/default.conf
else
  sed -i "s@resolverPLACEHOLDER@$TMP2@" /etc/nginx/conf.d/default.conf
fi

sed -i "s@PLACEHOLDER@$TMP@" /etc/nginx/conf.d/default.conf