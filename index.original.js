const { response } = require("express");
const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;

const commerce = require("./modules/commerce");
const core = require("./modules/core");

let commerceClientConfig = undefined;
let coreBearerToken = undefined;

express()
  .use(express.static(path.join(__dirname, "public")))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs")
  .get("/nissantosf", (req, res) => headUnitRequest(req, res))
  .get("/", (req, res) => res.render("pages/index"))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

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
    case "offers":
      commerceClientConfig = commerceClientConfig || await commerce.getClientConfig();
      responseJSON = await commerce.headUnitAction(commerceClientConfig, actionId, itemId, VIN);
      break;
    //
    // Unhandled
    //
    default:
      console.log("ENTRY => Unhandled actionId/itemsId\n".red, `${actionId}/${itemId}`);
      break;
  }

  res.send(responseJSON);
}
