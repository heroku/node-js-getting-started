# node-js-sample

This is a barebones Node.js app using the [Express](http://expressjs.com/) framework.

## Running Locally

Asumming you have [Node.js](http://nodejs.org/) and [Heroku Toolbelt](https://toolbelt.heroku.com/) installed on your machine:

```sh
git clone git@github.com:heroku/node-js-sample.git # or clone your own fork
cd node-js-sample
npm install
foreman start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
heroku create
git push heroku master
heroku open
```

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Building a Real-time, Polyglot Application with Node.js, Ruby, MongoDB and Socket.IO](https://devcenter.heroku.com/articles/realtime-polyglot-app-node-ruby-mongodb-socketio)
- [Using Socket.IO with Node.js on Heroku]https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku