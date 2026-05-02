FROM node:24-alpine

WORKDIR /honk

COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 6000
CMD ["node", "index.js"]