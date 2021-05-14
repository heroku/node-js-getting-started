import axios, { AxiosRequestConfig } from "axios";
import * as CommerceSdk from "commerce-sdk";
import colors = require("colors");
import qs = require("querystring");

const CLIENT_ID = "b615fee3-e306-4318-bcc1-bf49c13358f4";
const CLIENT_SECRET = "Sandbox2101!";
const ORG_ID = "f_ecom_zzsa_096";
const SHORT_CODE = "kv7kzm78";
const SITE_ID = "Ford";
const TENANT_SCOPE = "SALESFORCE_COMMERCE_API:zzsa_096";

const OAUTH_URL = "https://account.demandware.com/dwsso/oauth2/access_token";

let sessionBasketId = undefined;

async function getAdminClientConfig() {
  let adminClientConfig: CommerceSdk.ClientConfig = {
    headers: {},
    parameters: {
      clientId: CLIENT_ID,
      organizationId: ORG_ID,
      shortCode: SHORT_CODE,
      siteId: SITE_ID,
    },
  };

  let bearerToken = undefined;

  const axiosConfig : AxiosRequestConfig = {
    method: "POST",
    url: OAUTH_URL,
    headers: { 
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    },
    data: qs.stringify({
      'grant_type': 'client_credentials',
      'scope': TENANT_SCOPE
    })
  };

  await axios(axiosConfig)
    .then((res) => {
      bearerToken = "Bearer " + res.data.access_token;
      adminClientConfig.headers["authorization"] = bearerToken;
      console.log(`Account Manager OAuth YAY!:\n`);
      console.log(adminClientConfig);
      console.log(`Account Manager Scopes:\n`);
      console.log(res.data.scope);
    })
    .catch((error) => {
      console.log(`Account Manager OAuth Error: ${error}`);
      console.log(`Axios Configuration:\n`);
      console.log(axiosConfig);
    });

  return adminClientConfig;
}

async function getShopperClientConfig() {
  let shopperClientConfig: CommerceSdk.ClientConfig = {
    headers: {},
    parameters: {
      clientId: CLIENT_ID,
      organizationId: ORG_ID,
      shortCode: SHORT_CODE,
      siteId: SITE_ID,
    },
  };

  await CommerceSdk.helpers
    .getShopperToken(shopperClientConfig, { type: "guest" })
    .then((token) => {
      shopperClientConfig.headers["authorization"] = token.getBearerHeader();
    })
    .catch(async (e) => {
      shopperClientConfig = undefined;
      console.error(e);
      console.error(await e.response.text());
    });

  //console.log(shopperClientConfig);
  return shopperClientConfig;
}

function headUnitAction(adminClientConfig, clientConfig, actionId, itemId, VIN) {
  let flowResponse = undefined;

  switch (actionId) {
    case "buy":
      flowResponse = headUnitBuy(clientConfig, itemId);
      break;
    case "checkout":
      flowResponse = headUnitCheckout(adminClientConfig, clientConfig);
      break;
    case "offers":
      flowResponse = headUnitOffers(clientConfig, itemId);
      break;
  }

  return flowResponse;
}

async function headUnitBuy(clientConfig, itemId) {
  console.log("ENTRY commerce.headUnitBuy() => Handled actionId/itemsId\n".green, `buy/${itemId}`);
  let flowResponse = { buy: [] };

  let basket = await addProductToBasket(clientConfig, itemId);

  if (basket) {
    flowResponse.buy.push({
      title: "Item Added",
      itemId: "",
      actionId: "checkout", // TODO: this was the product id like "DP-100"
      shortDescription: "Cart Updated",
      longDescription: "Dave says Your Product Has Been Added to the Shopping Cart",
      imageurl: "https://nissantosf.herokuapp.com/cart.png",
      price: basket.productItems[basket.productItems.length - 1].price.toString(),
      buttons: "Dave Checkout TODO",
    });

  } else {
    console.log("Error adding product to basket");
  }

  return flowResponse;
}

async function headUnitCheckout(adminClientConfig, clientConfig) {
  console.log("ENTRY commerce.headUnitBuy() => Faked actionId\n".cyan, `checkout`);
  let flowResponse = { checkout: [] };

  let order = await createOrder(adminClientConfig, clientConfig);

  if (order) {
    flowResponse.checkout.push({
      title: "Order Created!",
      itemId: "",
      actionId: "todo", // TODO: this was the product id like "DP-100"
      shortDescription: "Order Created",
      longDescription: "Dave says Your Product Has Been Added to the Shopping Cart",
      imageurl: "https://nissantosf.herokuapp.com/cart.png",
      price: order.orderTotal.toString(),
      buttons: "TADA TODO",
    });

  } else {
    console.log("Error adding product to basket");
  }

  return flowResponse;
}

async function headUnitOffers(clientConfig, itemId) {
  console.log("ENTRY commerce.headUnitOffers() => Handled actionId/itemsId\n".green, `offers/${itemId}`);
  let flowResponse = { offers: [] };

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
            imageurl: product.imageGroups[0].images[0].disBaseLink,
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

async function createOrder(adminClientConfig, clientConfig) {
  try {
    const basketClient = await getBasketClient(clientConfig);
    let basketId = await getBasketId(basketClient);

    const shopperOrdersClient = await getShopperOrdersClient(clientConfig);

    let order = await shopperOrdersClient.createOrder({
      body: { basketId: basketId }
    });

    const ordersClient = await getOrdersClient(adminClientConfig);

    await ordersClient.updateOrderConfirmationStatus({
      parameters: { orderNo: order.orderNo },
      body: { status: "confirmed" }
    });

    await ordersClient.updateOrderStatus({
      parameters: { orderNo: order.orderNo },
      body: { status: "new" }
    });

    await ordersClient.updateOrderExportStatus({
      parameters: { orderNo: order.orderNo },
      body: { status: "ready" }
    });

    return order;
  } catch (e) {
    console.error(e);
    console.error(await e.response.text());
    return undefined;
  }
}

async function getBasketClient(clientConfig) {
  return new CommerceSdk.Checkout.ShopperBaskets(clientConfig);
}

async function getShopperOrdersClient(clientConfig) {
  return new CommerceSdk.Checkout.ShopperOrders(clientConfig);
}

async function getOrdersClient(accountManagerClientConfig) {
  return new CommerceSdk.Checkout.Orders(accountManagerClientConfig);
}

async function getBasketId(basketClient: CommerceSdk.Checkout.ShopperBaskets) {
  let basketId = sessionBasketId;

  if (!basketId) {
    let customerBasket = await basketClient.createBasket({
      body: {
        billingAddress: getBillingAddress(),
        shipments: getShipments(),
        paymentInstruments: getPaymentInstruments(),
        customerInfo: {
          email: "dfoley@salesforce.com"
        }
      },
    });

    sessionBasketId = customerBasket.basketId;
    basketId = customerBasket.basketId;
  }

  return basketId;
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
      shippingMethod: {
        id: "001"
      }
    },
  ];
}

function getPaymentInstruments() {
  return [
    {
      "amount": 1000,
      "authorizationStatus": {
        "code": "",
        "message": "",
        "status": 0
      },
      "paymentCard": {
        "cardType": "Visa",
        "creditCardExpired": false,
        "expirationMonth": 12,
        "expirationYear": 2025,
        "holder": "HeadUnit Cardholder",
        "issueNumber": "4111111111111111"
      },
      "paymentInstrumentId": "",
      "paymentMethodId": "CREDIT_CARD"
    }
  ];
}

export { getAdminClientConfig, getShopperClientConfig, headUnitAction };
