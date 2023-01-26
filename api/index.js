const express = require("express");
const axios = require("axios");
const redis = require("redis");

const API_URL =
  "http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider";
const API_URL2 =
  "http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider";

const app = express();
const client = redis.createClient();

client.on("error", (err) => console.log("<:: Redis Client Error", err));
client.on("connect", () => console.log("::> Redis Client Connected"));

const PROVIDER = "brazilian_provider";
const PROVIDER2 = "european_provider";
const UNAVAILABLE = "unavailable";
const DEFAULT_LIMIT = 10;
let lastId = 0;

/* A middleware that allows the server to accept requests from other domains. */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.listen(3000, "localhost", () => {
  console.log("Servidor iniciado na porta 3000");
});

app.get("/products", (req, res) => {
  res.set("Cache-Control", "public, max-age=31536000");
  try {
    const offset = validateOffset(req.query.offset);
    const limit = validateLimit(req.query.limit);
    /* Getting the products from the cache. */
    client.get("products", async (err, data) => {
      /* Checking if the data is already in the cache. */
      if (data) {
        let products = JSON.parse(data);
        /* Limiting the number of products returned. */
        products = products.slice(offset, offset + limit);
        res.json(products);
        return;
      } else {
        /* Fetching the data from the two APIs. */
        const products1 = await axios.get(API_URL);
        const products2 = await axios.get(API_URL2);

        /* Creating a new array with the products from both providers. */
        let products = [
          ...products1.data.map((p) => transformProduct(p, PROVIDER)),
          ...products2.data.map((p) => transformProduct(p, PROVIDER2)),
        ];

        /* Limiting the number of products returned. */
        products = products.slice(offset, offset + limit);

        /* Setting the products in the cache. */
        client.set("products", JSON.stringify(products));

        res.json(products);
      }
    });
  } catch (error) {
    /* Returning an error message to the client. */
    res.status(500).json({ error: "Error getting products" });
  }
});

/**
 * It takes a product and a source and returns a new object with the same properties as the
 * product, but with some of the values transformed
 * @param product - the product object from the provider
 * @param source - the provider of the product
 * @returns An object with the following properties:
 * id: ++lastId,
 * name: product.nome,
 * category: product.categoria,
 * department: product.departamento,
 * description: product.descricao,
 * image: product.imagem,
 * material: product.material,
 * price: product.preco,
 * hasDiscount: false
 */
function transformProduct(product, source) {
  if (source === PROVIDER) {
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
  } else if (source === PROVIDER2) {
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
}

function validateOffset(offset) {
  if (!offset || isNaN(offset) || parseInt(offset) < 0) {
    return 0;
  }
  return parseInt(offset);
}

function validateLimit(limit) {
  if (!limit || isNaN(limit) || parseInt(limit) < 1) {
    return DEFAULT_LIMIT;
  }
  return parseInt(limit);
}
