# Stay Classy, Facebook

[FBgraph](http://criso.github.com/fbgraph/) is a nodejs module that provides easy access to the facebook graph api

### Version: 1.1.0

## Oh nooooooesss - MOAR facebook

  I created this because I wanted to access FB's graph from `node`.
  The libraries I found, felt clunky to me, and I needed an excuse to create a node module.

  All calls will return `json`. Facebook sometimes (on friend requests, deleting test users, access token request)
  decides to just return a `string` or `true` or redirects directly to the image. I say __nay-nay__! Let's make it Disney, and keep things consistent!


## Installation via npm
    $ npm install fbgraph

    var graph = require('fbgraph');

## Authentication

If you get an accesstoken via some other Oauth module like [everyauth](https://github.com/bnoguchi/everyauth) ,
[connect-auth](https://github.com/ciaranj/connect-auth) or [node-oauth](https://github.com/ciaranj/node-oauth) you can just set
the access token directly. Most `get` calls, and pretty much all `post` calls will require an `access_token`


### Static access token (used on all calls)
```js
    graph.setAccessToken(access_token);
```

### To use a specific access token for a particular request
```js
    // pass it in as part of the url
    graph.post(userId + "/feed?access_token=007", wallPost, function(err, res) {
        // returns the post id
        console.log(res); // { id: xxxxx}
    });

```


This is how you would get authenticated using only the `fbgraph` module.
More details below on the __express app__ section

```js
    // get authorization url
    var authUrl = graph.getOauthUrl({
        "client_id":     conf.client_id
      , "redirect_uri":  conf.redirect_uri
    });

    // shows dialog
    res.redirect(authUrl);

    // after user click, auth `code` will be set
    // we'll send that and get the access token
    graph.authorize({
        "client_id":      conf.client_id
      , "redirect_uri":   conf.redirect_uri
      , "client_secret":  conf.client_secret
      , "code":           req.query.code
    }, function (err, facebookRes) {
      res.redirect('/loggedIn');
    });
```

### Securing API calls

Facebook [recommends](https://developers.facebook.com/docs/reference/api/securing-graph-api/) adding the
`appsecret_proof` parameter to all API calls to verify that the access tokens are coming from a valid app.
You can make this happen automatically by calling `graph.setAppSecret(app_secret)`, which will be used on
all calls to generate the `appsecret_proof` hash that is sent to Facebook.  Make sure you also set the
access token for the user via `graph.setAccessToken`.

## Extending access token expiration time

If you want to [extend the expiration time](http://developers.facebook.com/docs/facebook-login/access-tokens/#extending) of your short-living access token, you may use `extendAccessToken` method as it is shown below:

```js
    // extending static access token
    graph.extendAccessToken({
        "client_id":      conf.client_id
      , "client_secret":  conf.client_secret
    }, function (err, facebookRes) {
       console.log(facebookRes);
    });

    // extending specific access token
    graph.extendAccessToken({
        "access_token":    client_access_token
      , "client_id":      conf.client_id
      , "client_secret":  conf.client_secret
    }, function (err, facebookRes) {
       console.log(facebookRes);
    });


```


## How requests are made
All calls are made using the [request](https://github.com/mikeal/request)  nodejs module
__Why?__ something to do with wheels and re-invention.

Request options are directly mapped and can be set like so:

```js
var options = {
    timeout:  3000
  , pool:     { maxSockets:  Infinity }
  , headers:  { connection:  "keep-alive" }
};

graph
  .setOptions(options)
  .get("zuck", function(err, res) {
    console.log(res); // { id: '4', name: 'Mark Zuckerberg'... }
  });
```

Possible options can be found on the [request github page](https://github.com/mikeal/request)

`followRedirect` cannot be overriden and has a default value of `false`
`encoding` will have `utf-8` as default if nothing is set

### Request Object
The request object is exposed as a property on graph object. So that all the [request](https://github.com/mikeal/request) api can be accessed.

```js
var graphObject = graph
  .get("zuck", function(err, res) {
    console.log(res); // { id: '4', name: 'Mark Zuckerberg'... }
  });

// abort the request.
graphObject.request.abort();

```

### Pagination
Pagination in Facebook is done either with a `cursor` or a `next` url to call.
To simplify the fbgraph API, it's possible to use a fully constructed URL in order to get
the next page. See the following example:

```js
// note: you might want to prevent the callback hell :)
graph.get('likes', {limit: 2, access_token: "foobar"}, function(err, res) {
  if(res.paging && res.paging.next) {
    graph.get(res.paging.next, function(err, res) {
      // page 2
    });
  }
});
```

## Read data from the Graph Api

```js
graph.get("zuck", function(err, res) {
  console.log(res); // { id: '4', name: 'Mark Zuckerberg'... }
});
```

params in the `url`

```js
graph.get("zuck?fields=picture", function(err, res) {
  console.log(res); // { picture: 'http://profile.ak.fbcdn.net/'... }
});
```

params as an `object`

```js
var params = { fields: "picture" };

graph.get("zuck", params,  function(err, res) {
  console.log(res); // { picture: "http://profile.ak.fbcdn.net/..." }
});
```

GraphApi calls that __redirect__ directly to an image
will return a `json` response with relevant fields

```js
graph.get("/zuck/picture", function(err, res) {
  console.log(res); // { image: true, location: "http://profile.ak.fb..." }
});
```

## Search data from the Graph Api

Search for public posts that contain __brogramming__

```js
var searchOptions = {
    q:     "brogramming"
  , type:  "post"
};

graph.search(searchOptions, function(err, res) {
  console.log(res); // {data: [{id: xxx, from: ...}, {id: xxx, from: ...}]}
});
```

## Publish data to the Graph Api
All publish requests will require an `access token`

only needs to be set once

```js
graph.setAccessToken(accessToken);
```



Post a message on the user's wall

```js
var wallPost = {
  message: "I'm gonna come at you like a spider monkey, chip!"
};

graph.post("/feed", wallPost, function(err, res) {
  // returns the post id
  console.log(res); // { id: xxxxx}
});
```

## Delete a Graph object

To delete a graph object, provide an `object id` and the
response will return `{data: true}` or `{data:false}`

```js
graph.del(postID, function(err, res) {
  console.log(res); // {data:true}/{data:false}
});
```

## Performing a batch request

[Batching](https://developers.facebook.com/docs/graph-api/making-multiple-requests) allows you to pass instructions for several operations in a single HTTP request.

```js
graph.batch([
  {
    method: "GET",
    relative_url: "me" // Get the current user's profile information
  },
  {
    method: "GET",
    relative_url: "me/friends?limit=50" // Get the first 50 friends of the current user
  }
], function(err, res) {
  console.log(res);
  // [
  //   {
  //     "code": 200, 
  //     "headers":[
  //       {"name": "Content-Type", "value": "text/javascript; charset=UTF-8"}
  //     ],
  //     "body": "{\"id\":\"…\"}"
  //   },
  //   {
  //     "code": 200,
  //     "headers":[
  //       {"name": "Content-Type", "value": "text/javascript; charset=UTF-8"}
  //     ],
  //     "body":"{\"data\": [{…}]}"
  //   }
  // ]
});
```

## Performing a FQL query

A single FQL query is done by sending a query as a string

```js
var query = "SELECT name FROM user WHERE uid = me()";

graph.fql(query, function(err, res) {
  console.log(res); // { data: [ { name: 'Ricky Bobby' } ] }
});
```

You can specify additional options by adding a JSON object
```js
var query = "SELECT name FROM user WHERE uid = me()";
var options = {access_token: "foobar"};

graph.fql(query, options, function(err, res) {
  console.log(res); // { data: [ { name: 'Ricky Bobby' } ] }
});
```

## Performing a FQL Multi-Query

FQL Multi-Queries are done by sending in an object containing the separate queries

```js
var query = {
    name:         "SELECT name FROM user WHERE uid = me()"
  , permissions:  "SELECT email, user_about_me, user_birthday FROM permissions WHERE uid = me()"
};

graph.fql(query, function(err, res) {
  console.log(res);
  // { data: [
  //   { name: 'name', fql_result_set: [{name: 'Ricky Bobby'}] },
  //   { name: 'permissions', fql_result_set: [{email: 1, user_about_me: 1...}] }
  // ]}
});
```

## Rockin' it on an Express App

This example assumes that you have a link on the main page `/` that points to `/auth/facebook`.
The user will click this link and get into the facebook authorization flow ( if the user hasn't already connected)
After `authorizing` the app the user will be redirected to `/UserHasLoggedIn`

```js
/**
 * Module dependencies.
 */

var express   = require('express')
  , graph     = require('fbgraph')
  , app       = module.exports = express.createServer();

// this should really be in a config file!
var conf = {
    client_id:      'YOUR FACEBOOK APP ID'
  , client_secret:  'YOU FACEBOOK APP SECRET'
  , scope:          'email, user_about_me, user_birthday, user_location, publish_stream'
  , redirect_uri:   'http://localhost:3000/auth/facebook'
};

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req, res){
  res.render("index", { title: "click link to connect" });
});

app.get('/auth/facebook', function(req, res) {

  // we don't have a code yet
  // so we'll redirect to the oauth dialog
  if (!req.query.code) {
    var authUrl = graph.getOauthUrl({
        "client_id":     conf.client_id
      , "redirect_uri":  conf.redirect_uri
      , "scope":         conf.scope
    });

    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
      res.redirect(authUrl);
    } else {  //req.query.error == 'access_denied'
      res.send('access denied');
    }
    return;
  }

  // code is set
  // we'll send that and get the access token
  graph.authorize({
      "client_id":      conf.client_id
    , "redirect_uri":   conf.redirect_uri
    , "client_secret":  conf.client_secret
    , "code":           req.query.code
  }, function (err, facebookRes) {
    res.redirect('/UserHasLoggedIn');
  });


});


// user gets sent here after being authorized
app.get('/UserHasLoggedIn', function(req, res) {
  res.render("index", { title: "Logged In" });
});


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Express server listening on port %d", port);
});

```

## Running tests

 Before running the test suite, add your Facebook `appId` and `appSecret` to `tests/config.js`
 This is needed to create `test users` and to get a test `access_token`

    $ npm install
    $ make test

 _Tests might fail if the Facebook api has an issue._

## License

(The MIT License)

Copyright (c) 2011 Cristiano Oliveira &lt;ocean.cris@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
