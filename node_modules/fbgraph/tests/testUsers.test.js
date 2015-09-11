var graph    = require("../index")
  , FBConfig = require("./config").facebook
  , vows     = require("vows")
  , assert   = require("assert");


var testUser1      = {}
  , testUser2      = {}
  , appAccessToken = FBConfig.appId + "|" + FBConfig.appSecret
  , wallPost       = { message: "I'm gonna come at you like a spider monkey, chip" };


vows.describe("testUser.test").addBatch({
  "Before starting a test suite": {
    topic:  function () {
      return graph.setAccessToken(null);
    },

    "*access token* should be null": function (graph) {
      assert.isNull(graph.getAccessToken());
    }
  }

}).addBatch({
  "With test users": {
    topic: function () {
      // create test user
      var testUserUrl = FBConfig.appId + "/accounts/test-users";
      var params = {
          installed:     true
        , name:          "Rocket Man"
        , permissions:   FBConfig.scope
        , method:        "post"
        , access_token:  appAccessToken
      };

      graph.get(testUserUrl, params, this.callback);
    },

    "we should be able to create *user 1*": function(res) {
      assert.isNotNull(res);
    },

    "after creating *user 1*": {
      topic: function (res) {
        testUser1 = res;

        // create test user
        var testUserUrl = FBConfig.appId + "/accounts/test-users";
        var params = {
            installed:     true
          , name:          "Magic Man"
          , permissions:   FBConfig.scope
          , method:        "post"
          , access_token:  appAccessToken
        };

        graph.get(testUserUrl, params, this.callback);
      },

      "we should be able to create *user 2*": function(res) {
        assert.isNotNull(res);
      },

      "and *user2* ": {
        topic: function (res) {
          testUser2 = res;

          // The first call should be made with access token of user1
          // This will creates a friend request from user1 to user2
          var apiUrl =  testUser1.id + "/friends/" + testUser2.id
            + "?method=post";

          graph.setAccessToken(testUser1.access_token);
          graph.get(encodeURI(apiUrl), this.callback);
        },

        "*user1* should send a friend request": function(res) {
          assert.isNotNull(res);
        },

        "and after a friend request has been made": {

          topic: function (res) {
            var apiUrl =  testUser2.id + "/friends/" + testUser1.id 
              + "?method=post";

            // The second call should be made with access
            // token for user2 and will confirm the request.
            graph.setAccessToken(testUser2.access_token);
            graph.get(encodeURI(apiUrl), this.callback);
          },

          "*user2* should accept friend request": function (res) {
            assert.equal(res.data, "true");
          },

          " - a post on *user1*'s wall" : {
            topic: function() {
              graph.setAccessToken(testUser1.access_token);
              graph.post(testUser2.id + "/feed", wallPost, this.callback);
            },

            "should have a response with an id": function (res) {
              assert.include(res, 'id');
            },

            "when queried": {
              topic: function (res) {
                graph.get(res.id, this.callback);
              },

              "should be valid": function (res) {
                assert.isNotNull(res);
                assert.equal(res.message, wallPost.message);
                assert.equal(res.from.id, testUser1.id);
              }
            }
          }
        }
      }
    }
  }
}).addBatch({

  "When tests are over": {
    topic: function () {
      return graph.setAccessToken(appAccessToken);
    },

    "after reseting the access token - ": {
      "test *user 1*": {
        topic: function (graph) {
          graph.del(testUser1.id, this.callback);
        },

        "should be removed": function(res){
          assert.equal(res.data, "true");
        }
      },

      "test *user 2*": {
        topic: function (graph) {
          graph.del(testUser2.id, this.callback);
        },

        "should be removed": function(res){
          assert.equal(res.data, "true");
        }
      }
    }
  }
}).export(module);
