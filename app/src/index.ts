import { response } from "express"
import express = require("express")
import path from "path"
import colors = require("colors");
import { ClientConfig } from "commerce-sdk";
import * as commerce from "./modules/commerce"
import * as core from "./modules/core"

const PORT = process.env.PORT || 5000;

let commerceClientConfig : ClientConfig = undefined;
let coreBearerToken = undefined;

express()
  .use(express.static(path.join(__dirname, "public")))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/nissantosf", (req, res) => headUnitRequest(req, res))
  .get("/", (req, res) => res.render("pages/index"))
  .listen(PORT, () => console.log(colors.yellow(`Listening on ${PORT}`)));

async function headUnitRequest(req, res) {
  const VIN = "12312312312KKLJAS879892";
  let actionId = req.query.actionId;
  let itemId = req.query.itemId;

  let responseJSON;

  switch (actionId) {
    //
    // Salesforce Core
    //
    case "case":
    case "notifications":
    case "options":
    case "report":
      coreBearerToken = coreBearerToken || await core.getBearerToken();
      responseJSON = await core.headUnitAction(coreBearerToken, actionId, itemId, VIN);
      break;
    //
    // Salesforce B2C Commerce
    //
    case "buy":
    case "checkout":
    case "offers":
      commerceClientConfig = commerceClientConfig || await commerce.getClientConfig();
      responseJSON = await commerce.headUnitAction(commerceClientConfig, actionId, itemId, VIN);
      break;
    //
    // Unhandled
    //
    default:
      console.log(colors.red("ENTRY index() => Unhandled actionId/itemsId\n"), `${actionId}/${itemId}`);
      break;
  }

  res.send(responseJSON);
}
