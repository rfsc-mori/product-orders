FROM node:17 AS development

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:17 AS production

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .
