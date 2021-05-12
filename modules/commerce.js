const { ClientConfig, helpers, Search, Product } = require("commerce-sdk");
const colors = require("colors");

const CLIENT_ID = "d51df44a-c1db-4f25-9946-f494a8ba9a9d";
const ORG_ID = "f_ecom_zzsa_096";
const SHORT_CODE = "kv7kzm78";
const SITE_ID = "Ford";

async function getClientConfig() {

  let clientConfig = {
    headers: {},
    parameters: {
      clientId: CLIENT_ID,
      organizationId: ORG_ID,
      shortCode: SHORT_CODE,
      siteId: SITE_ID,
    },
  };

  await helpers.getShopperToken(clientConfig, { type: "guest" })
    .then((token) => {
      console.log(`Token ${token.getBearerHeader()}`);
      clientConfig.headers["authorization"] = token.getBearerHeader();
    })
    .catch(async (e) => {
      clientConfig = undefined;
      console.error(e);
      console.error(await e.response.text());
    });

  return clientConfig;
}

async function headUnitAction(clientConfig, actionId, itemId, VIN) {
  console.log("ENTRY => Faked actionId/itemsId\n".cyan, `${actionId}/${itemId}`);
  let flowResponse = undefined;

  switch (itemId) {
    case "dataplan":
      flowResponse = getOffersDataPlan();
      break;
    case "application":
      flowResponse = getOffersApplication();
      break;
  }

  const searchClient = new Search.ShopperSearch(clientConfig);
  const productClient = new Product.ShopperProducts(clientConfig);

  try {
    const searchResults = await searchClient.productSearch({
      parameters: { refine: `cgid=${itemId}`, limit: 5 },
    });
  
    if (searchResults.total) {
      try {
        const productIds = searchResults.hits
          .map(hit => hit.productId)
          .reduce((accumulator, currentValue) => accumulator + "," + currentValue)

        const productResults = await productClient.getProducts({
          parameters: { ids: productIds }
        });
      
        if (productResults.data.length > 0) {
          const firstResult = productResults.data[0];
    
          flowResponse.offers.push({
            title: firstResult.name,
            itemId: firstResult.id,
            actionId: "buy", //TODO get this from BM
            shortDescription: firstResult.shortDescription,
            longDescription: firstResult.longDescription,
            imageurl: firstResult.imageGroups[0].images[0].link,
            price: firstResult.price.toString(),
            buttons: "Dave TODO",
          });    
        } else {
          console.log("XXXXX No results for search");
        }
      
      } catch (e) {
        console.error(e);
        console.error(await e.response.text());
      }

    } else {
      console.log("No results for search");
    }
  
  } catch (e) {
    console.error(e);
    console.error(await e.response.text());
  }

  return flowResponse;
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

module.exports = { getClientConfig, headUnitAction };
