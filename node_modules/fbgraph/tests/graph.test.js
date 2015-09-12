var graph    = require("../index")
  , FBConfig = require("./config").facebook
  , vows     = require("vows")
  , events   = require("events")
  , assert   = require("assert");


var testUser1      = {}
  , appAccessToken = FBConfig.appId + "|" + FBConfig.appSecret
  , testUserParams = {
      installed:     true
    , name:          "Ricky Bobby"
    , permissions:   FBConfig.scope
    , method:        "post"
    , access_token:  appAccessToken
  };


vows.describe("graph.test").addBatch({
  "Before starting a test suite": {
    topic:  function () {
      return graph.setAccessToken(null);
    },

    "*Access Token* should be null": function (graph) {
      assert.isNull(graph.getAccessToken());
    },

    "should be able to set *request* options": function (graph) {
      var options = {
          timeout:  30000
        , pool:     false
        , headers:  { connection:  "keep-alive" }
      };

      graph.setOptions(options);
      assert.equal(graph.getOptions(), options);

      // reset
      graph.setOptions({});
    }
  }
}).addBatch({
  "When accessing the graphApi": {
    "with no *Access Token** ": {
      "and searching for public data via username": {
        topic: function() {
          graph.get("/btaylor", this.callback);
        },

        "should get public data": function (err, res) {
          assert.include(res, "username");
          assert.include(res, "name");
          assert.include(res, "first_name");
          assert.include(res, "last_name");
        }
      },

      "and requesting an url for a user that does not exist": {
        topic: function () {
          graph.get("/thisUserNameShouldNotExist", this.callback);
        },

        "should return an error": function (err, res) {
          assert.include(res, "error");
        }
      },

      "and not using a string as an api url": {
        topic: function () {
          graph.get({ you: "shall not pass" }, this.callback);
        },

        "should return an api must be a string error": function (err, res) {
          assert.equal(err.message, "Graph api url must be a string",
          "Should return an error if api url is not a string");
        }
      },

      "and requesting a public profile picture": {
        topic: function () {
          graph.get("/zuck/picture", this.callback);
        },

        "should get an image and return a json with its location ": function (err, res) {
          assert.include(res, "image");
          assert.include(res, "location");
        }
      },

      "and requesting an api url with a missing slash": {
        topic: function () {
          graph.get("zuck/picture", this.callback);
        },

        "should be able to get valid data": function (err, res) {
          assert.include(res, "image");
          assert.include(res, "location");
        }
      },

      "and requesting an api url with prefixed graphurl": {
        topic: function() {
          graph.get(graph.getGraphUrl() + "/zuck/picture", this.callback);
        },

        "should be able to get valid data": function (err, res) {
          assert.include(res, "image");
          assert.include(res, "location");
        }
      },

      "and trying to access data that requires an access token": {
        topic: function () {
          graph.get("/817129783203", this.callback);
        },

        "should return an OAuthException error": function (err, res) {
          assert.include(res, "error");
          assert.equal(res.error.type, "OAuthException",
            "Response from facebook should be an OAuthException");
        }
      },

      "and performing a public search ": {
        topic: function () {
          graph.search({ q: "watermelon", type: "post" }, this.callback);
        },

        "should return valid data": function (err, res) {
          assert.isNotNull(res);	
          assert.isArray(res.data);
          assert.ok(res.data.length > 1, "response data should not be empty");
        }
      },

    },

    "with an *Access Token* ": {
      topic: function () {
        var promise = new events.EventEmitter();

        // create test user
        var testUserUrl = FBConfig.appId + "/accounts/test-users";

        graph.get(testUserUrl, testUserParams, function(err, res) {

          if (!res || res.error
            && ~res.error.message.indexOf("Service temporarily unavailable")) {

            promise.emit("error", err);
            console.error("Can't retreive access token from facebook\n" +
            "Try again in a few minutes");
          } else {

            graph.setAccessToken(res.access_token);
            testUser1 = res;
            promise.emit("success", res);
          }
        });

        return promise;
      },

      // following tests will only happen after 
      // an access token has been set
      "result *keys* should be valid": function(err, res) {
        assert.isNull(err);
        assert.include(res, "id");
        assert.include(res, "access_token");
        assert.include(res, "login_url");
        assert.include(res, "email");
        assert.include(res, "password");
      },

      "and getting data from a protected page": {
        topic: function () {
          graph.get("/817129783203", this.callback);
        },

        "response should be valid": function(err, res) {
          assert.isNull(err);
          assert.equal("817129783203", res.id, "response id should be valid");
        }
      },

      "and getting a user permissions": {
        topic: function () {
          graph.get("/me/permissions", this.callback);
        },

        "test user should have proper permissions": function (err, res) {
          assert.isNull(err);

          var permissions = FBConfig.scope
            .replace(/ /g,"")
            .split(",");

          permissions.push("installed");

          permissions.forEach(function(key) {
            assert.include(res.data[0], key);
          });
        }
      },

      "and performing a search": {
        topic: function () {
          var searchOptions = {
              q:       "coffee"
            , type:    "place"
            , center:  "37.76,-122.427"
            , distance: 1000
          };

          graph.search(searchOptions, this.callback);
        },

        "an *Access Token* required search should return valid data": function (err, res) {
          assert.isNull(err);
          assert.ok(res.data.length > 1, "response data should not be empty");
        }
      },

      "and requesting a FQL query": {
        topic: function () {
          var query = "SELECT name FROM user WHERE uid = me()";

          graph.fql(query, this.callback);    
        },

        "should return valid data": function (err, res) {
          assert.isNull(err);
          assert.include(res, 'data');
          assert.isArray(res.data);
          assert.equal(res.data[0].name, testUserParams.name);
        }
      },

      "and requesting a FQL multi-query": {
        topic: function () {
          var query = {
              name:         "SELECT name FROM user WHERE uid = me()"
            , permissions:  "SELECT " + FBConfig.scope + " FROM permissions WHERE uid = me()"
          };

          graph.fql(query, this.callback);    
        },

        "should return valid data": function (err, res) {
          assert.isNull(err);
          assert.include(res, 'data');
          assert.isArray(res.data);

          var nameQuery  = {}
            , permsQuery = {};
        
          if (res.data[0].name === 'name') {
            nameQuery  = res.data[0];
            permsQuery = res.data[1];
          } else {
            permsQuery = res.data[0];
            nameQuery  = res.data[1];
          }

          assert.isArray(nameQuery.fql_result_set);
          assert.isArray(permsQuery.fql_result_set);
          assert.equal(nameQuery.fql_result_set[0].name, testUserParams.name);

          console.dir(permsQuery.fql_result_set);
          var permissions = permsQuery.fql_result_set[0];

          testUserParams.permissions.split(', ').forEach(function(permission) {
            assert.include(permissions, permission); 
          });
        }
      }
    }
  }
}).addBatch({
  "When tests are over": {
    topic: function () {
      graph.del(testUser1.id, this.callback);
    },

    "test users should be removed": function(res){
      assert.equal(res.data, "true");
    }
  }
}).export(module);
