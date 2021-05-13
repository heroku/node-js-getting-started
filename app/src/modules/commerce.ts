import * as CommerceSdk from "commerce-sdk";
import colors = require("colors");

const CLIENT_ID = "d51df44a-c1db-4f25-9946-f494a8ba9a9d";
const ORG_ID = "f_ecom_zzsa_096";
const SHORT_CODE = "kv7kzm78";
const SITE_ID = "Ford";

let sessionBasketId = undefined;

async function headUnitAction(clientConfig, actionId, itemId, VIN) {
  console.log("ENTRY commerce.headUnitAction() => Faked actionId/itemsId\n".cyan, `${actionId}/${itemId}`);
  let flowResponse = undefined;

  switch (actionId) {
    case "buy":
      flowResponse = await headUnitBuy(clientConfig, itemId);
      break;
    case "offers":
      flowResponse = await headUnitOffers(clientConfig, itemId);
      break;
  }

  return flowResponse;
}

async function headUnitOffers(clientConfig, itemId) {
  let flowResponse = undefined;

  const searchClient = new CommerceSdk.Search.ShopperSearch(clientConfig);
  const productClient = new CommerceSdk.Product.ShopperProducts(clientConfig);

  switch (itemId) {
    case "dataplan":
      flowResponse = getOffersDataPlanResponse();
      break;
    case "application":
      flowResponse = getOffersApplicationResponse();
      break;
  }

  try {
    const searchResults = await searchClient.productSearch({
      parameters: { refine: [`cgid=${itemId}`], limit: 5 },
    });

    if (searchResults.total) {
      try {
        const productIds = searchResults.hits
          .map(hit => hit.productId)
          .reduce((accumulator, currentValue) => accumulator + "," + currentValue);

        const productResults = await productClient.getProducts({
          parameters: { ids: productIds }
        });

        if (productResults.data.length > 0) {
          const firstResult = productResults.data[0];

          flowResponse.offers.push({
            title: firstResult.name,
            itemId: firstResult.id,
            actionId: "buy",
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

async function headUnitBuy(clientConfig, itemId) {
  let flowResponse = undefined;

  let basket = await addProductToBasket(clientConfig, itemId);

  if (basket) {
    flowResponse = getBuyResponse();
  } else {
    console.log("Error adding product to basket");
  }

  return flowResponse;
}

async function getClientConfig() {
  let clientConfig : CommerceSdk.ClientConfig = {
    headers: {},
    parameters: {
      clientId: CLIENT_ID,
      organizationId: ORG_ID,
      shortCode: SHORT_CODE,
      siteId: SITE_ID,
    },
  };

  await CommerceSdk.helpers
    .getShopperToken(clientConfig, { type: "guest" })
    .then((token) => {
      clientConfig.headers["authorization"] = token.getBearerHeader();
    })
    .catch(async (e) => {
      clientConfig = undefined;
      console.error(e);
      console.error(await e.response.text());
    });

  return clientConfig;
}

async function getBasketClient(clientConfig) {
  return new CommerceSdk.Checkout.ShopperBaskets(clientConfig);
}

async function getBasketId(basketClient) {
  let basketId = sessionBasketId;

  if (!basketId) {
    let customerBasket = await basketClient.createBasket({
      body: {
        billingAddress: getBillingAddress(),
        shipments: getShipments(),
      },
    });

    sessionBasketId = customerBasket.basketId;
    basketId = customerBasket.basketId;
  }

  return basketId;
}

function getShipments() {
  return [
    {
      shippingAddress: {
        address1: "HeadUnit Shipping Address 1",
        address2: "HeadUnit Shipping Address 2",
        city: "St. Petersburg",
        countryCode: "US",
        firstName: "HeadUnit",
        fullName: "HeadUnit Test",
        lastName: "Test",
        phone: "6035311234",
        postalCode: "33701",
        stateCode: "FL",
      },
    },
  ];
}

function getBillingAddress() {
  return {
    address1: "HeadUnit Billing Address 1",
    address2: "HeadUnit Billing Address 2",
    city: "St. Petersburg",
    countryCode: "US",
    firstName: "HeadUnit",
    fullName: "HeadUnit Test",
    lastName: "Test",
    phone: "6035311234",
    postalCode: "33701",
    stateCode: "FL",
  };
}

async function addProductToBasket(clientConfig, productId) {
  try {
    const basketClient = await getBasketClient(clientConfig);
    let basketId = await getBasketId(basketClient);

    let basket = await basketClient.addItemToBasket({
      parameters: { basketId },
      body: [{ productId, quantity: 1.0 }],
    });
    return basket;
  } catch (e) {
    console.error(e);
    console.error(await e.response.text());
    return undefined;
  }
}

function getOffersDataPlanResponse() {
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

function getOffersApplicationResponse() {
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

function getBuyResponse() {
  return {
    buy: [
      {
        title: "Item Added",
        itemId: "",
        actionId: "checkout", // TODO: this was the product id like "DP-100"
        shortDescription: "Cart Updated",
        longDescription:
          "Dave says Your Product Has Been Added to the Shopping Cart",
        imageurl: "https://nissantosf.herokuapp.com/cart.png",
        price: "25.00",
        buttons: "Checkout",
      },
    ],
  };
}

export { getClientConfig, headUnitAction };
