FROM node:8-alpine

LABEL maintainer="Tom Bartindale <tom.bartindale@ncl.ac.uk>"

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

COPY . /usr/src/app

RUN apk add --virtual build-dependencies git python gcc g++ make --no-cache --update --repository http://dl-3.alpinelinux.org/alpine/edge/testing && \
	npm i -g grunt-cli nodemon --silent && \
	npm install --silent && \
	apk del git gcc g++ make python && \
	rm -rf /var/cache/apk/* && \
	grunt buildProd && \
	mkdir -p /usr/src/app/upload/ && \
	rm -R /usr/src/app/assets/music/ && \
	rm /usr/src/app/Gruntfile.js && \
	rm -R /usr/src/app/tasks && \
	npm prune --production && \
	apk del build-dependencies && \
	npm uninstall -g grunt-cli && \
	npm cache clean --force

EXPOSE 1337

VOLUME ["/usr/src/app/www","/usr/src/app/data","/usr/src/app/assets"]

CMD [ "npm", "start" ]