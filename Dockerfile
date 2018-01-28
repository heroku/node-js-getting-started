FROM node:carbon

WORKDIR /data

COPY package.json .
RUN npm install
RUN npm install -g nodemon
ENV PATH /data/node_modules/.bin:$PATH

COPY . /data/app
WORKDIR /data/app

EXPOSE 8080/TCP

CMD nodemon