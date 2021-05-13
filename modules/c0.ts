import axios, { AxiosRequestConfig } from "axios";
import colors = require("colors");


const CLIENT_ID = "3MVG9cHH2bfKACZaxOl_SD58KkCHXUgFnvVjQlpp3mrVQ.uVow6vx_oCG3SFG8wQ6OCdc7uGthgSS9RPSkrRL";
const CLIENT_SECRET = "2B6980F88F562E5B8014CF1587DEAA6D82B4E388016BB9019324F4C61B3ECDC1";
const USER_NAME = "dfoley@dfoley-21-spring.demo";
const PASSWORD = "Sandbox2101!";

const OAUTH_PATH = "/services/oauth2/token?grant_type=password";
const OAUTH_URL = `https://login.salesforce.com${OAUTH_PATH}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&username=${USER_NAME}&password=${PASSWORD}`;

const FLOW_API_URL = "https://dfoley-21-spring-demo.my.salesforce.com/services/data/v50.0/actions/custom/flow/Headunit_Flow_API";

async function getBearerToken() {
  let bearerToken = undefined;

  let axiosConfig : AxiosRequestConfig = {
    method: "post",
    url: OAUTH_URL,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  };

  await axios(axiosConfig)
    .then((res) => (bearerToken = "Bearer " + res.data.access_token))
    .catch((error) => console.log(`OAuth Error: ${error}`));

  return bearerToken;
}

async function headUnitAction(bearerToken, actionId, itemId, VIN) {
  console.log(colors.green("ENTRY core.headUnitAction() => Handled actionId/itemsId\n"), `${actionId}/${itemId}`);
  let flowResponse = undefined;

  let axiosConfig : AxiosRequestConfig = {
    method: "post",
    url: FLOW_API_URL,
    headers: { "Content-Type": "application/json", Authorization: bearerToken },
    data: { inputs: [{ actionId: actionId, itemId: itemId, VIN: VIN }] },
  };

  await axios(axiosConfig)
    .then((res) => (flowResponse = mapFlowResponse(actionId, itemId, res)))
    .catch((error) => console.log(`Flow Error: ${error}`));

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

export { getBearerToken, headUnitAction };
