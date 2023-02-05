const getProducts = require("../controllers/productsController.js").getProducts;
const getLinks = require("../utils/linkUtils.js").getLinks;
const validateOffset = require("../utils/validationUtils.js").validateOffset;
const validateLimit = require("../utils/validationUtils.js").validateLimit;
const handleValidationResponse =
  require("../utils/validationUtils.js").handleValidationResponse;

const jwt = require("jsonwebtoken");
const secret = "secretkey";

const express = require("express");
const router = express.Router();

router.get("/products", async (req, res, next) => {
  // const bearerHeader = req.headers["authorization"];

  // if (typeof bearerHeader === "undefined") {
  //   return res.status(401).json({ message: "Token não fornecido" });
  // }

  // const bearerToken = bearerHeader.split(" ")[1];

  // try {
  //   const decoded = jwt.verify(bearerToken, secret);
  // } catch (err) {
  //   return res.status(401).json({ message: "Token inválido" });
  // }

  try {
    res.set("Cache-Control", "public, max-age=31536000");

    const offset = handleValidationResponse(
      res,
      validateOffset(req.query.offset)
    );
    const limit = handleValidationResponse(res, validateLimit(req.query.limit));
    const products = handleValidationResponse(
      res,
      await getProducts(offset, limit)
    );

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

module.exports = router;
