FROM ghcr.io/nginxinc/nginx-unprivileged:1.25.3-alpine-slim
USER root
COPY ./build /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./set-env-variable.sh /docker-entrypoint.d
RUN chmod +x /docker-entrypoint.d/set-env-variable.sh
RUN dos2unix /docker-entrypoint.d/set-env-variable.sh
RUN chown -R 101 /usr/share/nginx/html
RUN chown -R 101 /etc/nginx/conf.d/default.conf
USER 101
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]