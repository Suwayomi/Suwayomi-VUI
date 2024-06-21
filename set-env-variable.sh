#!/bin/sh
# # if i need to add UI env variables in the future
# JSON_STRING='window.configs = { \
#   "APP_VAR":"'"${APP_VAR}"'" \
# }'
# sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /usr/share/nginx/html/index.html
# exec "$@"

TMP=$(echo "$suwayomi" | sed "s@/\$@@")

# get the resolver IPs from /etc/resolv.conf and make them nginx syntax
TMP2=$(awk '
#if ipv4 print it
$1=="nameserver" && $2~/^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])\.?){4}$/{
    print $2
}
# if the ip isnt ipv4 assume its ipv6 and surround it in []
$1=="nameserver" && $2!~/^((25[0-5]|(2[0-4]|1[0-9]|[1-9]|)[0-9])\.?){4}$/{
    print "["$2"]"
}' /etc/resolv.conf)
sed -i "s@resolverPLACEHOLDER@$TMP2@" /etc/nginx/conf.d/default.conf
sed -i "s@PLACEHOLDER@$TMP@" /etc/nginx/conf.d/default.conf

find . -name '*.html' -exec sed -i -e "s/data-theme='skeleton'/data-theme='${theme:=skeleton}/g" {} \;
