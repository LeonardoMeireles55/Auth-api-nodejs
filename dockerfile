FROM node:21.6.2-alpine3.18
WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

CMD ["yarn", "start"]
