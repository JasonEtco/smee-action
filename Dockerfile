FROM node:alpine
COPY package*.json ./
RUN npm ci
COPY . .
ENTRYPOINT ["node", "/index.js"]
