const {
  getCacheProducts,
  setCacheProducts,
  fetchProducts,
} = require("../utils/dataUtils.js");

const getProducts = async (offset, limit) => {
  try {
    let products = await getCacheProducts();
    if (!products) {
      products = await fetchProducts();
      setCacheProducts(products);
    }
    return products.slice(offset, offset + limit);
  } catch (error) {
    throw new Error("Error getting products", error);
  }
};

module.exports = {
  getProducts,
};
