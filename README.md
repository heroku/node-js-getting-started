<img src="https://travis-ci.org/HIROSN/node-js-getting-started.svg" alt="Travis CI Badge"></img>

## Create a JSON api with a Mongo Persistence Layer and get it running on Heroku
https://hirosn-node-js-getting-started.herokuapp.com/

A barebones Node.js app using [Express 4](http://expressjs.com/).
This application support the [Getting Started with Node on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku Toolbelt](https://toolbelt.heroku.com/) installed.

```sh
$ git clone git@github.com:hirosn/node-js-getting-started.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
$ mongod --smallfiles --dbpath ./data/db
$ npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```

## Running MongoDB in Travis CI

```
$ cat .travis.yml
language: node_js
node_js:
  - "0.10"
services:
  - mongodb
```

## MongoDB URL environment variable for Heroku

```
$ heroku config
=== hirosn-node-js-getting-started Config Vars
MONGOHQ_URL: mongodb://heroku:_w0aAOeuYx8hW0Kb...
```

## Handlebars and GET API

```
$ superagent https://hirosn-node-js-getting-started.herokuapp.com/api/notes GET
{ Notes:
   [ { noteBody: 'hello world',
       _id: '545efd6ca6d75d02004aec51',
       __v: 0 } ] }
```

```
<script id="notes-template" type="text/x-handlebars-template">
  {{#each Notes}}
  <p id="{{_id}}" class="note">{{noteBody}}</p>
  {{/each}}
</script>
```

## Use HTTPS to load libraries from CDN

```
<script
  src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js">
</script>
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0/handlebars.min.js">
</script>
```

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started with Node.js on Heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
