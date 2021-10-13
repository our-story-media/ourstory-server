FROM node:10-alpine AS builder

RUN mkdir -p /usr/src/app/upload

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN apk add --virtual build-dependencies git python gcc g++ make --no-cache --update --repository http://dl-3.alpinelinux.org/alpine/edge/testing && \
  npm i -g grunt-cli --silent && \
  npm install && \
  grunt buildProd && \
  apk del git gcc g++ make python && \
  rm -rf /var/cache/apk/* && \
  mkdir -p /usr/src/app/upload/ && \
  rm -R /usr/src/app/assets/music/ && \
  rm /usr/src/app/Gruntfile.js && \
  rm -R /usr/src/app/tasks && \
  npm prune --production && \
  apk del build-dependencies && \
  npm uninstall -g grunt-cli && \
  npm cache clean --force

# Final image:
FROM node:10-alpine

LABEL maintainer="Tom Bartindale <tom.bartindale@monash.edu>"

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

EXPOSE 1337

VOLUME ["/usr/src/app/www","/usr/src/app/data","/usr/src/app/assets"]

CMD [ "npm", "start" ]