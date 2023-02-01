const { getProducts } = require("../controllers/productsController");
const { validateOffset, validateLimit } = require("../utils/validationUtils");

const express = require("express");
const app = express();

app.get("/products", async (req, res) => {
  res.set("Cache-Control", "public, max-age=31536000");
  try {
    const offset = validateOffset(req.query.offset);
    const limit = validateLimit(req.query.limit);
    const products = await getProducts(offset, limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error getting products" });
  }
});

module.exports = app;
