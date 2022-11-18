FROM node:16-alpine3.16

WORKDIR /app
ADD package.json .
ADD yarn.lock .
RUN yarn

ADD src src

# TODO: build frontend in multistage
WORKDIR /app/admin-panel
ADD admin-panel/package.json .
ADD admin-panel/yarn.lock .
RUN yarn
ADD admin-panel/tsconfig.json .
ADD admin-panel/tsconfig.node.json .
ADD admin-panel/vite.config.ts .
ADD admin-panel/index.html .
ADD admin-panel/src src
ADD admin-panel/public public
RUN yarn build

WORKDIR /app

ENTRYPOINT [ "yarn", "start" ]
