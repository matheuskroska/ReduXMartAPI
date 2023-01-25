const express = require("express");
const app = express();
const axios = require("axios");

// cria uma constante para armazenar a url da API
const API_URL =
  "http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider";
const API_URL2 =
  "http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider";

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

// cria uma rota para buscar produtos
app.get("/products", async (req, res) => {
  try {
    // faz uma chamada GET para a API e armazena a resposta em uma constante
    const { data: products1 } = await axios.get(API_URL);
    const { data: products2 } = await axios.get(API_URL2);

    // Armazena os resultados das chamadas em um array
    const products = [products1, products2];

    res.json(products);
  } catch (error) {
    // trata erro
    res.status(500).json({ error: "Error getting products" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    // obtém o ID do produto a partir dos parâmetros de rota
    const id = req.params.id;

    // faz uma chamada GET para a API1 com o ID do produto como parâmetro
    const { data: product1 } = await axios.get(`${API_URL}/${id}`);

    // faz uma chamada GET para a API2 com o ID do produto como parâmetro
    const { data: product2 } = await axios.get(`${API_URL2}/${id}`);

    // Armazena os resultados das chamadas em um array
    const products = [product1, product2];

    res.json(products);
  } catch (error) {
    // trata erro
    res.status(500).json({ error: "Error getting product" });
  }
});
