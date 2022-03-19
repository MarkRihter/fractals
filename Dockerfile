FROM node:16.14.0-alpine

WORKDIR /usr/app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .

RUN yarn run build:worker
RUN yarn build
