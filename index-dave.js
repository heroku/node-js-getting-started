const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;

const CLIENT_ID = "3MVG9cHH2bfKACZaxOl_SD58KkCHXUgFnvVjQlpp3mrVQ.uVow6vx_oCG3SFG8wQ6OCdc7uGthgSS9RPSkrRL";
const CLIENT_SECRET = "2B6980F88F562E5B8014CF1587DEAA6D82B4E388016BB9019324F4C61B3ECDC1";
const USER_NAME = "dfoley@dfoley-21-spring.demo";
const PASSWORD = "Sandbox2101!";

const PATH_OAUTH = "/services/oauth2/token?grant_type=password";
const PATH_FLOW = "/services/data/v33.0/actions/custom/flow/Headunit_Flow_API";

const REQ_OPTIONS_OAUTH_TOKEN = {
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  hostname: "login.salesforce.com",
  method: "POST",
  path: `${PATH_OAUTH}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&username=${USER_NAME}&password=${PASSWORD}`,
  port: 443,
};

const REQ_OPTIONS_FLOW = {
  headers: { "Content-Type": "application/json" },
  hostname: "dfoley-21-spring-demo.lightning.force.com",
  method: "POST",
  path: `${PATH_FLOW}`,
  port: 443,
};

const REQ_OPTIONS_SOQL = {

};

const VIN = "12312312312KKLJAS879892";

const http = require("https");
let token = "FILL IN";
let options2;
let salesforceresponse = "";

express()
  .use(express.static(path.join(__dirname, "public")))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/nissantosf", (req, res) => daveTest(req, res))
  .get("/", (req, res) => res.render("pages/index"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

function daveTest(req, res) {
  console.log("Dave function called!!");

  var actionId = req.param("actionId");
  var itemId = req.param("itemId");

  console.log("actionId: " + actionId);
  console.log("itemId: " + itemId);
  console.log("VIN: " + VIN);

  let a = "a";
  let b = "b";

    let oAuthRequest = http.request(REQ_OPTIONS_OAUTH_TOKEN, function (res) {
      console.log("Status: " + res.statusCode);

      res.on("data", function (body) {
        token = setOAuthToken(body);
        var bearertoken = "Bearer " + token;

        jsonpayload =
          '{"inputs" : [ {"actionId" : "' +
          actionId +
          '","itemId": "' +
          itemId +
          '","VIN": "' +
          VIN +
          '"} ]}';

        console.log("here is jsonpayload: " + jsonpayload);

        REQ_OPTIONS_FLOW.headers.Authorization = bearertoken;
        console.log("Using this PE: nissantosf__e");

        let flowRequest = http.request(REQ_OPTIONS_FLOW, function (flowResponse) {
          console.log("Status: " + flowResponse.statusCode);
          var body = "";

          flowResponse.on("data", function (bodychunk) {
            body += bodychunk;
          });

          flowResponse.on("end", function () {
            console.log("SF Response: " + body);
            console.log("success, calling queryresponse: ");
            if (a === b) {
              queryresponse(token, flowResponse, VIN);
            }
          });
        });

        flowRequest.on("error", (e) => console.log("problem with request: " + e.message));
        flowRequest.write(jsonpayload);
        flowRequest.end();

      

      });
    });

    oAuthRequest.on("error", (e) => console.log("problem with request: " + e.message));

    // write data to request body
    oAuthRequest.end();

  res.render("pages/index");
}

function queryresponse(token, flowResponse, VIN) {
  //
  // This is a SOQL query that grabs the output from the Flow
  //
  var bearertoken = "Bearer " + token;
  var pathstring =
    "https://ecatron-20200804-demo.my.salesforce.com.my.salesforce.com/services/data/v20.0/query/?q=SELECT+Response__c+from+NissanCarResponse__c+where+VIN__c='" +
    VIN +
    "'";
  nissanoptions = {
    hostname: "ecatron-20200804-demo.my.salesforce.com",
    port: 443,
    path: pathstring,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: bearertoken,
    },
  };
  var reqnissan = http.request(nissanoptions, function (resnissan) {
    var body = "";
    console.log("Status: " + resnissan.statusCode);
    //console.log('Headers: ' + JSON.stringify(resnissan.headers));
    resnissan.on("data", function (nissanchunk) {
      body += nissanchunk;
      ////
    });
    resnissan.on("end", function () {
      console.log("###########nissan Body: " + body);
      var nissanobj = JSON.parse(body);
      for (x in nissanobj) {
        //console.log('nissan: '+x);
        if (x == "records") {
          console.log("Response[0]: " + nissanobj.records[0].Response__c);
          salesforceresponse = nissanobj.records[0].Response__c;
          console.log("salesforceresponse" + salesforceresponse);
          flowResponse.send(salesforceresponse);
        }
      }
    }); // response from nissan 'end'
  });
  reqnissan.on("error", function (e) {
    console.log("problem with request: " + e.message);
  });
  // write data to request body
  reqnissan.end();
  ////END of queryresponse
}

function setOAuthToken(body) {
  console.log("***********Body: " + body);
  var obj = JSON.parse(body);
  var keys = Object.keys(obj);
  console.log(obj[keys[0]]);
  token = obj[keys[0]];
  console.log("here is the token: " + token);
  return token;
}
