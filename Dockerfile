FROM node:16.13.1-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install -g npm@7.3.0

RUN npm install -g forever

RUN npm config set fetch-retry-maxtimeout 120000

RUN npm install

RUN npm run migrate

RUN npm run seed

RUN npm run build

COPY .env .

CMD ["forever", "dist/server/server.js"]
