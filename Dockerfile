FROM node:carbon

WORKDIR /app

COPY package.json .
RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 8080/TCP

CMD nodemon