"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.headUnitAction = exports.getClientConfig = void 0;
var CLIENT_ID = "d51df44a-c1db-4f25-9946-f494a8ba9a9d";
var ORG_ID = "f_ecom_zzsa_096";
var SHORT_CODE = "kv7kzm78";
var SITE_ID = "Ford";
var sessionBasketId = undefined;
function headUnitAction(clientConfig, actionId, itemId, VIN) {
    return __awaiter(this, void 0, void 0, function () {
        var flowResponse, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("ENTRY => Faked actionId/itemsId\n".cyan, actionId + "/" + itemId);
                    flowResponse = undefined;
                    _a = actionId;
                    switch (_a) {
                        case "buy": return [3 /*break*/, 1];
                        case "offers": return [3 /*break*/, 3];
                    }
                    return [3 /*break*/, 5];
                case 1: return [4 /*yield*/, headUnitBuy(clientConfig, itemId)];
                case 2:
                    flowResponse = _b.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, headUnitOffers(clientConfig, itemId)];
                case 4:
                    flowResponse = _b.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, flowResponse];
            }
        });
    });
}
exports.headUnitAction = headUnitAction;
function headUnitOffers(clientConfig, itemId) {
    return __awaiter(this, void 0, void 0, function () {
        var flowResponse;
        return __generator(this, function (_a) {
            flowResponse = undefined;
            // const searchClient = new Search.ShopperSearch(clientConfig);
            // const productClient = new Product.ShopperProducts(clientConfig);
            // switch (itemId) {
            //   case "dataplan":
            //     flowResponse = getOffersDataPlanResponse();
            //     break;
            //   case "application":
            //     flowResponse = getOffersApplicationResponse();
            //     break;
            // }
            // try {
            //   const searchResults = await searchClient.productSearch({
            //     parameters: { refine: [`cgid=${itemId}`], limit: 5 },
            //   });
            //   if (searchResults.total) {
            //     try {
            //       const productIds = searchResults.hits
            //         .map(hit => hit.productId)
            //         .reduce((accumulator, currentValue) => accumulator + "," + currentValue);
            //       const productResults = await productClient.getProducts({
            //         parameters: { ids: productIds }
            //       });
            //       if (productResults.data.length > 0) {
            //         const firstResult = productResults.data[0];
            //         flowResponse.offers.push({
            //           title: firstResult.name,
            //           itemId: firstResult.id,
            //           actionId: "buy",
            //           shortDescription: firstResult.shortDescription,
            //           longDescription: firstResult.longDescription,
            //           imageurl: firstResult.imageGroups[0].images[0].link,
            //           price: firstResult.price.toString(),
            //           buttons: "Dave TODO",
            //         });
            //       } else {
            //         console.log("XXXXX No results for search");
            //       }
            //     } catch (e) {
            //       console.error(e);
            //       console.error(await e.response.text());
            //     }
            //   } else {
            //     console.log("No results for search");
            //   }
            // } catch (e) {
            //   console.error(e);
            //   console.error(await e.response.text());
            // }
            return [2 /*return*/, flowResponse];
        });
    });
}
function headUnitBuy(clientConfig, itemId) {
    return __awaiter(this, void 0, void 0, function () {
        var flowResponse;
        return __generator(this, function (_a) {
            flowResponse = undefined;
            // let basket = await addProductToBasket(clientConfig, itemId);
            // if (basket) {
            //   flowResponse = getBuyResponse();
            // } else {
            //   console.log("Error adding product to basket");
            // }
            return [2 /*return*/, flowResponse];
        });
    });
}
function getClientConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var clientConfig;
        return __generator(this, function (_a) {
            clientConfig = {
                headers: {},
                parameters: {
                    clientId: CLIENT_ID,
                    organizationId: ORG_ID,
                    shortCode: SHORT_CODE,
                    siteId: SITE_ID
                }
            };
            // await helpers.getShopperToken(clientConfig, { type: "guest" })
            //   .then((token) => {
            //     clientConfig.headers["authorization"] = token.getBearerHeader();
            //   })
            //   .catch(async (e) => {
            //     clientConfig = undefined;
            //     console.error(e);
            //     console.error(await e.response.text());
            //   });
            return [2 /*return*/, clientConfig];
        });
    });
}
exports.getClientConfig = getClientConfig;
function getBasketClient(clientConfig) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
function getBasketId(basketClient) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
function addProductToBasket(clientConfig, productId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
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
                buttons: "Reserve"
            },
            {
                title: "Reserve a Shower",
                itemId: "DP-102",
                actionId: "buy",
                shortDescription: "You can reserve a shower here.",
                longDescription: "You can reserve a shower here.",
                imageurl: "https://nissantosf.herokuapp.com/level2.png",
                price: "10.00",
                buttons: "Reserve"
            },
            {
                title: "Order at Subway",
                itemId: "DP-104",
                actionId: "buy",
                shortDescription: "Order at Subway",
                longDescription: "Our sandwiches are delicious.",
                imageurl: "https://nissantosf.herokuapp.com/level1.png",
                price: "5.00",
                buttons: "Order"
            },
        ]
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
                buttons: "Reserve"
            },
            {
                title: "Wind Turbine EV Charging Station",
                itemId: "AP-106",
                actionId: "buy",
                shortDescription: "Wind Turbine EV Charging Station",
                longDescription: "Reserve a spot at the Wind Turbine EV Charging Station",
                imageurl: "https://nissantosf.herokuapp.com/Pumpkin.png",
                price: "",
                buttons: "Reserve"
            },
        ]
    };
}
function getBuyResponse() {
    return {
        "buy": [
            {
                "title": "Item Added",
                "itemId": "",
                "actionId": "checkout",
                "shortDescription": "Cart Updated",
                "longDescription": "Dave says Your Product Has Been Added to the Shopping Cart",
                "imageurl": "https://nissantosf.herokuapp.com/cart.png",
                "price": "25.00",
                "buttons": "Checkout"
            }
        ]
    };
}
