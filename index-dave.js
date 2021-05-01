const axios = require("axios");
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;

const CLIENT_ID = "3MVG9cHH2bfKACZaxOl_SD58KkCHXUgFnvVjQlpp3mrVQ.uVow6vx_oCG3SFG8wQ6OCdc7uGthgSS9RPSkrRL";
const CLIENT_SECRET = "2B6980F88F562E5B8014CF1587DEAA6D82B4E388016BB9019324F4C61B3ECDC1";
const USER_NAME = "dfoley@dfoley-21-spring.demo";
const PASSWORD = "Sandbox2101!";

const OAUTH_PATH = "/services/oauth2/token?grant_type=password";
const OAUTH_URL = `https://login.salesforce.com${OAUTH_PATH}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&username=${USER_NAME}&password=${PASSWORD}`;

const FLOW_API_URL = "https://dfoley-21-spring-demo.my.salesforce.com/services/data/v50.0/actions/custom/flow/Headunit_Flow_API";

express()
  .use(express.static(path.join(__dirname, "public")))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/nissantosf", (req, res) => daveTest(req, res))
  .get("/", (req, res) => res.render("pages/index"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

async function daveTest(req, res) {
  const VIN = "12312312312KKLJAS879892";
  var actionId = req.query.actionId;
  var itemId = req.query.itemId;

  //
  // Get bearer token from SFDC auth
  //
  let bearerToken = await postOAuth();

  //
  // Get JSON response from SFDC flow execution
  //
  let flowResponseJSON = await postHeadUnitAPI(bearerToken, actionId, itemId, VIN);

  //
  // Return response to caller
  //
  res.send(flowResponseJSON);
}

async function postOAuth() {
  let bearerToken = undefined;

  let axiosConfig = {
    method: "post",
    url: OAUTH_URL,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };

  await axios(axiosConfig)
    .then((res) => bearerToken = "Bearer " + res.data.access_token)
    .catch((error) => console.log(`OAuth Error: ${error}`));

  return bearerToken;
}

async function postHeadUnitAPI(bearerToken, actionId, itemId, VIN) {
  let flowResponseJSON = undefined;

  let axiosConfig = {
    method: "post",
    url: FLOW_API_URL,
    headers: { "Content-Type": "application/json", Authorization: bearerToken },
    data: { inputs: [{ actionId: actionId, itemId: itemId, VIN: VIN }] },
  };

  await axios(axiosConfig)
    .then((response) => {
      console.log(response.data)
      flowResponseJSON = response.data;
    })
    .catch((error) => console.log(`Flow Error: ${error}`));

  return flowResponseJSON;
}
