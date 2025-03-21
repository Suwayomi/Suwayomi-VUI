#!/bin/sh
# # if i need to add UI env variables in the future
# JSON_STRING='window.configs = { \
#   "APP_VAR":"'"${APP_VAR}"'" \
# }'
# sed -i "s@// CONFIGURATIONS_PLACEHOLDE@${JSON_STRING}@" /usr/share/nginx/html/index.html
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

cat /etc/nginx/conf.d/default.conf
echo "\n"

echo "resolverPLACEHOLDE -> $TMP2"
sed -i "s@resolverPLACEHOLDE@$TMP2@" /etc/nginx/conf.d/default.conf
echo "after sed resolverPLACEHOLDE"
cat /etc/nginx/conf.d/default.conf
echo "\n"

echo "urlPLACEHOLDE -> $TMP"
sed -i "s@urlPLACEHOLDE@$TMP@" /etc/nginx/conf.d/default.conf
echo "after sed urlPLACEHOLDE"
cat /etc/nginx/conf.d/default.conf
echo "\n"

cd /usr/share/nginx/html
# test
THEME="${theme:-skeleton}"
find . -name '*.html' -exec sed -i -e "s/data-theme=\"skeleton\"/data-theme=\"$THEME\"/g" {} \;

if [[ "${light}" = "true" || "${light}" = "True" || "${light}" = "TRUE" ]]; then
    find . -name '*.html' -exec sed -i -e 's/<html lang="en" class="dark">/<html lang="en" class>/g' {} \;
fi

echo "completed set-env-variable.sh"
