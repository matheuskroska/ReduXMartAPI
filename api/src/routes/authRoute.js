const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth_username = process.env.USER;
const auth_pass = process.env.PASSWORD;

router.post("/authenticate", (req, res) => {
  const { username, password } = req.body;

  // Verificar credenciais aqui
  if (username === auth_username && password === auth_pass) {
    const payload = { username };
    const token = generateToken(payload);

    res.json({ message: "Autenticação realizada com sucesso", token });
  } else {
    res.status(401).json({ message: "Credenciais inválidas" });
  }
});

const generateToken = (payload) => {
  return jwt.sign(payload, "secret_key", { expiresIn: "1h" });
};

module.exports = router;
