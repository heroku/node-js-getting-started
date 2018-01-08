FROM node:carbon

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 5000/TCP

CMD node index.js