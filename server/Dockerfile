FROM node

WORKDIR /

COPY encryption encryption

WORKDIR /api

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .