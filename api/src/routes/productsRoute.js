const getProducts = require("../controllers/productsController.js").getProducts;
const getLinks = require("../utils/linkUtils.js").getLinks;
const validateOffset = require("../utils/validationUtils.js").validateOffset;
const validateLimit = require("../utils/validationUtils.js").validateLimit;
const handleValidationResponse = require("../utils/validationUtils.js").handleValidationResponse;

const express = require("express");
const app = express();

app.get("/products", async (req, res, next) => {
  try {
    res.set("Cache-Control", "public, max-age=31536000");

    const offset = handleValidationResponse(res, validateOffset(req.query.offset));
    const limit = handleValidationResponse(res, validateLimit(req.query.limit));
    const products = handleValidationResponse(res, await getProducts(offset, limit));

    const response = {
      message: "Products fetched successfully",
      data: products,
      links: getLinks(offset, limit),
    };

    res.status(200).send(response);
  } catch (error) {
    next(error);
  }
});

module.exports = app;
