FROM node:latest
WORKDIR /dist
COPY package*.json ./
RUN npm install
COPY dist/ ./
