const express = require("express");
const productRoute = require("./routes/productRoute");

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

app.listen(port, "localhost", () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get("/products", productRoute);
