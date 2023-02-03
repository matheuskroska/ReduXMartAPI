const PROVIDER = "brazilian_provider";
const PROVIDER2 = "european_provider";
const UNAVAILABLE = "unavailable";
let lastId = 0;

const redis = require("redis");
const client = redis.createClient();
const axios = require("axios");

client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", () => console.log("Redis Client Connected"));

const API_URL =
  "http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider";
const API_URL2 =
  "http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider";

/**
 * @function fetchProducts
 * @description Fetches products data from two different APIs and maps the data to a specific format
 * @returns {Array} - An array of products in the desired format
 */
const fetchProducts = async () => {
  try {
    console.log("Fetching products from API1...");
    const products1 = await axios.get(API_URL);
    console.log(`Retrieved ${products1.data.length} products from API1`);
    console.log("Fetching products from API2...");
    const products2 = await axios.get(API_URL2);
    console.log(`Retrieved ${products2.data.length} products from API2`);
    return [
      ...products1.data.map((p) => transformProduct(p, PROVIDER)),
      ...products2.data.map((p) => transformProduct(p, PROVIDER2)),
    ];
  } catch (error) {
    console.error("Error fetching products from API", error);
    throw new Error("Error fetching products from API");
  }
};

/**
 * Transforms a product object based on its provider into a common format.
 * @param {Object} product - The product object to transform.
 * @param {string} provider - The provider of the product.
 * @returns {Object|null} The transformed product object in the common format, or null if there was an error.
 */
const transformProduct = (product, provider) => {
  /**
   * Gets the common properties of a product in the common format.
   * @returns {Object} The common properties of a product in the common format.
   */
  const getCommonProperties = () => ({
    id: ++lastId,
    description: product.description,
    image: product.gallery ? product.gallery[0] : product.imagem,
    material: product.material || product.details.material,
    price: product.price,
    provider,
  });

  /**
   * Gets the properties specific to a provider.
   * @param {string} provider - The provider of the product.
   * @returns {Object} The properties specific to the provider.
   * @throws {Error} If the provider is unknown.
   */
  const getProviderProperties = (provider) => {
    switch (provider) {
      case PROVIDER:
        return {
          name: product.nome,
          category: product.categoria,
          department: product.departamento,
          hasDiscount: false,
          discountValue: 0,
        };
      case PROVIDER2:
        return {
          name: product.name,
          category: product.details.adjective,
          department: UNAVAILABLE,
          hasDiscount: product.hasDiscount,
          discountValue: product.discountValue,
        };
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  };

  try {
    const commonProperties = getCommonProperties();
    return {
      ...commonProperties,
      ...getProviderProperties(provider),
    };
  } catch (error) {
    console.error(
      `Error transforming product from provider ${provider}: ${error}`
    );
    return null;
  }
};

/**
 * Retrieves the products from cache
 *
 * @returns {Promise} - Resolves with the cached products or rejects with an error if the retrieval fails
 */
const getCacheProducts = () => {
  return new Promise((resolve, reject) => {
    client.get("products", (err, data) => {
      if (err) {
        console.error("Error getting products from cache", err);
        reject(err);
      } else {
        console.log("Retrieved products from cache");
        resolve(JSON.parse(data));
      }
    });
  });
};

/**
Stores the products in cache.
@param {Array} products - The products to be stored in cache.
@returns {void}
*/
const setCacheProducts = (products) => {
  try {
    client.set("products", JSON.stringify(products));
    console.log("Stored products in cache");
  } catch (error) {
    console.error("Error storing products in cache", error);
  }
};

// export { fetchProducts, transformProduct, getCacheProducts, setCacheProducts };

module.exports = {
  fetchProducts,
  transformProduct,
  getCacheProducts,
  setCacheProducts,
};
