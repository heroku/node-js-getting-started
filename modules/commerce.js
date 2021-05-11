const { ClientConfig, helpers, Search } = require("commerce-sdk");

async function commerce() {
  // Create a configuration to use when creating API clients
  const config = {
    headers: {},
    parameters: {
      clientId: "d51df44a-c1db-4f25-9946-f494a8ba9a9d",
      organizationId: "f_ecom_zzsa_096",
      shortCode: "kv7kzm78",
      siteId: "RefArch",
    },
  };

  const searchResults = helpers
    .getShopperToken(config, { type: "guest" })
    .then(async (token) => {
      try {
        console.log(`Token ${token.getBearerHeader()}`);
        config.headers["authorization"] = token.getBearerHeader();

        // Create a new ShopperSearch API client
        const searchClient = new Search.ShopperSearch(config);

        // Search for dresses
        const searchResults = await searchClient.productSearch({
          parameters: { q: "dress", limit: 5 },
        });

        if (searchResults.total) {
          const firstResult = searchResults.hits[0];
          console.log(`${firstResult.productId} ${firstResult.productName}`);
        } else {
          console.log("No results for search");
        }

        return searchResults;
      } catch (e) {
        console.error(e);
        console.error(await e.response.text());
      }
    })
    .catch(async (e) => {
      console.error(e);
      console.error(await e.response.text());
    });
}

module.exports = { commerce };
