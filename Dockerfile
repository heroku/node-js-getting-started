FROM node:carbon

WORKDIR /app

COPY package.json /app
RUN npm install
COPY . /app

CMD node index.js

EXPOSE 5000/TCP