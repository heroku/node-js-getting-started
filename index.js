const axios = require("axios");
const colors = require("colors");
const { response } = require("express");
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;

const CLIENT_ID = "3MVG9cHH2bfKACZaxOl_SD58KkCHXUgFnvVjQlpp3mrVQ.uVow6vx_oCG3SFG8wQ6OCdc7uGthgSS9RPSkrRL";
const CLIENT_SECRET = "2B6980F88F562E5B8014CF1587DEAA6D82B4E388016BB9019324F4C61B3ECDC1";
const USER_NAME = "dfoley@dfoley-21-spring.demo";
const PASSWORD = "Sandbox2101!";

const OAUTH_PATH = "/services/oauth2/token?grant_type=password";
const OAUTH_URL = `https://login.salesforce.com${OAUTH_PATH}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&username=${USER_NAME}&password=${PASSWORD}`;

const FLOW_API_URL =
  "https://dfoley-21-spring-demo.my.salesforce.com/services/data/v50.0/actions/custom/flow/Headunit_Flow_API";

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
  let actionId = req.query.actionId;
  let itemId = req.query.itemId;

  let bearerToken;
  let responseJSON;

  switch (actionId) {
    case "case":
    case "notifications":
    case "options":
    case "report":
      bearerToken = await postOAuth();
      responseJSON = await postHeadUnitAPI(bearerToken, actionId, itemId, VIN);
      console.log("ENTRY => Handled actionId/itemsId\n".green, `${actionId}/${itemId}`);
      break;
    case "offers":
      switch (itemId) {
        case "dataplan":
          responseJSON = getOffersDataPlan();
          console.log("ENTRY => Faked actionId/itemsId\n".cyan, `${actionId}/${itemId}`);
          break;
        case "application":
          responseJSON = getOffersApplication();
          console.log("ENTRY => Faked actionId/itemsId\n".cyan, `${actionId}/${itemId}`);
          break;
      }
      break;
    case "buy":
      responseJSON = getBuy(itemId);
      console.log("ENTRY => Faked actionId/itemsId\n".cyan, `${actionId}/${itemId}`);
      break;
    case "gas":
      responseJSON = getGasNavigate();
      console.log("ENTRY => Faked actionId/itemsId\n".cyan, `${actionId}/${itemId}`);
      break;
    case "tires":
      responseJSON = getTiresShop();
      console.log("ENTRY => Faked actionId/itemsId\n".cyan, `${actionId}/${itemId}`);
      break;
    default:
      console.log("ENTRY => Unhandled actionId/itemsId\n".red, `${actionId}/${itemId}`);
      break;
  }

  res.send(responseJSON);
}

async function postOAuth() {
  let bearerToken = undefined;

  let axiosConfig = {
    method: "post",
    url: OAUTH_URL,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };

  await axios(axiosConfig)
    .then((res) => (bearerToken = "Bearer " + res.data.access_token))
    .catch((error) => console.log(`OAuth Error: ${error}`));

  //console.log('EXIT postOAuth() => bearerToken\n'.green, bearerToken)
  return bearerToken;
}

async function postHeadUnitAPI(bearerToken, actionId, itemId, VIN) {
  let flowResponse = undefined;

  let axiosConfig = {
    method: "post",
    url: FLOW_API_URL,
    headers: { "Content-Type": "application/json", Authorization: bearerToken },
    data: { inputs: [{ actionId: actionId, itemId: itemId, VIN: VIN }] },
  };

  await axios(axiosConfig)
    .then((res) => flowResponse = mapFlowResponse(actionId, itemId, res))
    .catch((error) => console.log(`Flow Error: ${error}`));

  //console.log('EXIT postHeadUnitAPI() => flowResponse\n'.cyan, flowResponse)
  return flowResponse;
}

function mapFlowResponse(actionId, itemId, res) {
  let coreOutputValues = res.data[0].outputValues;
  let coreResponse;

  switch (actionId) {
    case "case":
      return coreOutputValues.HeadUnitCaseResponse;
    case "notifications":
      coreResponse = coreOutputValues.DaveHeadUnitNotifications;
      break;
    case "offers":
      coreResponse = coreOutputValues.DaveHeadUnitOffers;
      break;
    case "options":
      coreResponse = coreOutputValues.DaveHeadUnitOptions;
      break;
    case "report":
      return coreOutputValues.HeadUnitReportSummaryResponse;
    }

  let flowResponseDave = {
    [actionId]: coreResponse.map((src) => {
      return {
        title: "Dave71 " + src.ShortDescription__c,
        itemId: src.producttype__c ? src.producttype__c : "",
        actionId: src.Type__c,
        shortDescription: "Dave 72 " + src.ShortDescription__c,
        longDescription: src.LongDescription__c,
        imageurl: src.imageurl__c,
        price: "",
        buttons: src.button__c ? src.button__c : "",
      };
    }),
  };

  return flowResponseDave;
}

function getOffersDataPlan() {
  return {
    offers: [
      {
        title: "Reserve a Parking Spot",
        itemId: "DP-100",
        actionId: "buy",
        shortDescription: "Reserve a Parking Spot",
        longDescription: "You look very tired. Reserve a Parking Spot",
        imageurl: "https://nissantosf.herokuapp.com/level3.png",
        price: "25.00",
        buttons: "Reserve",
      },
      {
        title: "Reserve a Shower",
        itemId: "DP-102",
        actionId: "buy",
        shortDescription: "You can reserve a shower here.",
        longDescription: "You can reserve a shower here.",
        imageurl: "https://nissantosf.herokuapp.com/level2.png",
        price: "10.00",
        buttons: "Reserve",
      },
      {
        title: "Order at Subway",
        itemId: "DP-104",
        actionId: "buy",
        shortDescription: "Order at Subway",
        longDescription: "Our sandwiches are delicious.",
        imageurl: "https://nissantosf.herokuapp.com/level1.png",
        price: "5.00",
        buttons: "Order",
      },
    ],
  };
}

function getOffersApplication() {
  return {
    offers: [
      {
        title: "Hydrogen Fuel",
        itemId: "AP-100",
        actionId: "buy",
        shortDescription: "Hydrogen Fuel",
        longDescription: "Fill up now with totally Green Hydrogen Fuel!",
        imageurl: "https://nissantosf.herokuapp.com/hydrogen.png",
        price: "",
        buttons: "Reserve",
      },
      {
        title: "Wind Turbine EV Charging Station",
        itemId: "AP-106",
        actionId: "buy",
        shortDescription: "Wind Turbine EV Charging Station",
        longDescription:
          "Reserve a spot at the Wind Turbine EV Charging Station",
        imageurl: "https://nissantosf.herokuapp.com/Pumpkin.png",
        price: "",
        buttons: "Reserve",
      },
    ],
  };
}

function getBuy(itemId) {}

function getGasNavigate() {}

function getTiresShop() {}
