// import express from "express";
// import productRoute from "./routes/productsRoute.js";
const express = require("express");
const productsRoute = require("./routes/productsRoute.js");
const authRoute = require("./routes/authRoute.js");

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

/* A middleware that parses the body of the request and makes it available in the req.body property. */
app.use(express.json());

app.get("/products", productsRoute);
app.post("/authenticate", authRoute);

app.listen(port, "localhost", () => {
  console.log(`Server running at http://localhost:${port}`);
});
