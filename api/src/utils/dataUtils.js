const PROVIDER = "brazilian_provider";
const PROVIDER2 = "european_provider";
const UNAVAILABLE = "unavailable";
let lastId = 0;

import redis from "redis";
const client = redis.createClient();

client.on("error", (err) => console.log("Redis Client Error", err));
client.on("connect", () => console.log("Redis Client Connected"));

const API_URL =
  "http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider";
const API_URL2 =
  "http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider";

/**
Fetches product data from two API endpoints.
@returns {Array} An array of product data transformed into a standard format.
*/
const fetchProducts = async () => {
  const products1 = await axios.get(API_URL);
  const products2 = await axios.get(API_URL2);
  return [
    ...products1.data.map((p) => transformProduct(p, PROVIDER)),
    ...products2.data.map((p) => transformProduct(p, PROVIDER2)),
  ];
};

/**
Transforms product data into a standard format.
@param {Object} product - The product data to be transformed.
@param {String} provider - The provider of the product data.
@returns {Object} The transformed product data in a standard format.
*/
const transformProduct = (product, provider) => {
  if (provider === PROVIDER) {
    return {
      id: ++lastId,
      name: product.nome,
      category: product.categoria,
      department: product.departamento,
      description: product.descricao,
      image: product.imagem,
      material: product.material,
      price: product.preco,
      hasDiscount: false,
      discountValue: 0,
      provider: PROVIDER,
    };
  } else if (provider === PROVIDER2) {
    return {
      id: ++lastId,
      name: product.name,
      category: product.details.adjective,
      department: UNAVAILABLE,
      description: product.description,
      image: product.gallery[0],
      material: product.details.material,
      price: product.price,
      hasDiscount: product.hasDiscount,
      discountValue: product.discountValue,
      provider: PROVIDER2,
    };
  }
};

/**
 *Retrieves the products from cache.
 *@returns {Promise} A Promise that resolves with the parsed JSON data of the "products" key in cache, or rejects with an error if there was a problem accessing the cache.
 */
const getCacheProducts = () => {
  return new Promise((resolve, reject) => {
    client.get("products", (err, data) => {
      if (err) {
        reject(err);
      } else {
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
  client.set("products", JSON.stringify(products));
};

export { fetchProducts, transformProduct, getCacheProducts, setCacheProducts };
