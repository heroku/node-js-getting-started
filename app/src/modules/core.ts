import axios, { AxiosRequestConfig } from "axios";
import colors = require("colors");

//
// Load constants from .env Environment Variables
//
const OAUTH_URL = 
  process.env.CORE_HOST + 
  process.env.CORE_OAUTH_PATH +
  "&client_id=" + process.env.CORE_CLIENT_ID +
  "&client_secret=" + process.env.CORE_CLIENT_SECRET +
  "&username=" + process.env.CORE_USER_NAME +
  "&password=" + process.env.CORE_PASSWORD;
  
const FLOW_API_URL = process.env.CORE_FLOW_API_URL;

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
        title: src.ShortDescription__c,
        itemId: src.producttype__c ? src.producttype__c : "",
        actionId: src.Type__c,
        shortDescription: src.ShortDescription__c,
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
