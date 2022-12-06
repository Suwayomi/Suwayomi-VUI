# develop stage
FROM node:19-alpine as develop-stage
ARG VERSION='test'
WORKDIR /app
COPY package*.json ./
RUN npm install -g @quasar/cli
COPY . .
# build stage
FROM develop-stage as build-stage
RUN npm install
RUN VERSION=$VERSION npm run build
# production stage
FROM nginxinc/nginx-unprivileged:1.23.2-alpine-slim as production-stage
USER root
COPY --from=build-stage /app/dist/pwa /usr/share/nginx/html
COPY ./set-env-variable.sh /docker-entrypoint.d
RUN chmod +x /docker-entrypoint.d/set-env-variable.sh
RUN dos2unix /docker-entrypoint.d/set-env-variable.sh
RUN chown -R 101 /usr/share/nginx/html
USER 101
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
