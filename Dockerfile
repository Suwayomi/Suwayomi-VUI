# develop stage
FROM node:19-alpine as develop-stage
WORKDIR /app
COPY package*.json ./
RUN npm install -g @quasar/cli
COPY . .
# build stage
FROM develop-stage as build-stage
RUN npm install
RUN npm run build
# production stage
FROM nginxinc/nginx-unprivileged:1.23.2-alpine-slim as production-stage
COPY --from=build-stage /app/dist/pwa /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
