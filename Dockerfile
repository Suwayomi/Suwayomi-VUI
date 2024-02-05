# develop stage
FROM node:lts-alpine as develop-stage
WORKDIR /app
COPY . .
ARG version="DevBuild"
RUN sed -i "s@BUILD_VERSION_PLACEHOLDER@${version}@" ./src/app.html
# RUN sed -i "s@TRACKING_PLACEHOLDER@docker@" ./src/app.html
# build stage
FROM develop-stage as build-stage
RUN npm install
RUN npm run build
# production stage
FROM ghcr.io/nginxinc/nginx-unprivileged:1.25.3-alpine-slim as production-stage
USER root
COPY --from=build-stage /app/build /usr/share/nginx/html
# COPY ./build /usr/share/nginx/html
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./set-env-variable.sh /docker-entrypoint.d
RUN chmod +x /docker-entrypoint.d/set-env-variable.sh
RUN dos2unix /docker-entrypoint.d/set-env-variable.sh
RUN chown -R 101 /usr/share/nginx/html
USER 101
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]