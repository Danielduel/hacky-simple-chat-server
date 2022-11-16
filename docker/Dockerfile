FROM node:16-alpine3.16

WORKDIR /app
ADD package.json .
ADD yarn.lock .
RUN yarn

ADD src src
ADD testclient testclient

ENTRYPOINT [ "yarn", "start" ]
