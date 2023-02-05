const dataUtils = require("../utils/dataUtils");
const getCacheProducts = dataUtils.getCacheProducts;
const setCacheProducts = dataUtils.setCacheProducts;
const fetchProducts = dataUtils.fetchProducts;

/**
 * Retrieves a specified number of products based on an offset and limit
 * @async
 * @function
 * @param {number} offset - The starting index for retrieving products
 * @param {number} limit - The number of products to retrieve
 * @returns {Array} An array of products
 * @throws {Error} If an error occurs while getting products
 */
const getProducts = async (offset, limit) => {
  let products = await getCacheProducts();

  if (!products) {
    products = await fetchProducts();
    setCacheProducts(products);
  }

  if (offset >= products.length) {
    console.log("Offset is greater than the number of products");
    return {
      message: "Offset is greater than the number of products",
      status: 404,
    };
  }

  return {
    data: products.slice(offset, offset + limit),
    length: products.length,
  };
};

module.exports = {
  getProducts,
};
