#!/bin/sh
# # if i need to add UI env variables in the future
# JSON_STRING='window.configs = { \
#   "APP_VAR":"'"${APP_VAR}"'" \
# }'
# sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /usr/share/nginx/html/index.html
# exec "$@"

TMP=$(echo "$suwayomi" | sed "s@/\$@@")
TMP2=$(awk '$1=="nameserver" && $2~/^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])\.?){4}$/ {print $2}' /etc/resolv.conf)
sed -i "s@resolverPLACEHOLDER@$TMP2@" /etc/nginx/conf.d/default.conf
sed -i "s@PLACEHOLDER@$TMP@" /etc/nginx/conf.d/default.conf