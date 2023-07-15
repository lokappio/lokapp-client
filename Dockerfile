# build environment
FROM node:18.16.1-alpine3.18 as build-stage
WORKDIR /app
COPY package.json /app/package.json

RUN apk --no-cache add --virtual native-deps g++ gcc libgcc libstdc++ linux-headers make python3 py3-pip && npm install --quiet && apk del native-deps

COPY . /app

RUN npm run build

# production environment
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d

#Use to inject env var at runtime to VueJS (VueJS needs .env removed to be injected at buildtime otherwise)
COPY ./docker/entrypoint.sh /entrypoint.sh

EXPOSE 80
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]