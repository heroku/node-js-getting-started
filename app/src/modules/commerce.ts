import * as CommerceSdk from "commerce-sdk";
import colors = require("colors");

const CLIENT_ID = "d51df44a-c1db-4f25-9946-f494a8ba9a9d";
const ORG_ID = "f_ecom_zzsa_096";
const SHORT_CODE = "kv7kzm78";
const SITE_ID = "Ford";

let sessionBasketId = undefined;

function headUnitAction(clientConfig, actionId, itemId, VIN) {
  let flowResponse = undefined;

  switch (actionId) {
    case "buy":
      flowResponse = headUnitBuy(clientConfig, itemId);
      break;
    case "offers":
      flowResponse = headUnitOffers(clientConfig, itemId);
      break;
  }

  return flowResponse;
}

async function headUnitOffers(clientConfig, itemId) {
  console.log("ENTRY commerce.headUnitOffers() => Faked actionId/itemsId\n".green, `offers/${itemId}`);
  let flowResponse = {offers: []};

  const searchClient = new CommerceSdk.Search.ShopperSearch(clientConfig);
  const productClient = new CommerceSdk.Product.ShopperProducts(clientConfig);

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

        productResults.data.forEach(product => {
          flowResponse.offers.push({
            title: product.name,
            itemId: product.id,
            actionId: "buy",
            shortDescription: product.shortDescription,
            longDescription: product.longDescription,
            imageurl: product.imageGroups[0].images[0].link,
            price: product.price.toString(),
            buttons: "Dave Loop TODO",
          });
        })

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
  console.log("ENTRY commerce.headUnitBuy() => Faked actionId/itemsId\n".cyan, `buy/${itemId}`);
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
