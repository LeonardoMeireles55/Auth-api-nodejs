FROM node:slim
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
CMD ["yarn","dev", "index.js"]