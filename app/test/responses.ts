
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
  