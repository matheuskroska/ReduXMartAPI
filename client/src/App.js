import axios from "axios";
import React, { useState, useEffect } from "react";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Verifica se há dados armazenados no LocalStorage
        const storedProducts = JSON.parse(localStorage.getItem("products"));
        if (storedProducts && storedProducts.length) {
          // Se houver, verifica se a quantidade de dados armazenados é a mesma que a requerida
          const { data: products } = await axios.get(
            "http://localhost:3000/products"
          );
          if (storedProducts.length === products.length) {
            // Se sim, usa os dados armazenados
            setProducts(storedProducts);
            console.log(storedProducts);
            console.log("Há dados armazenados no LocalStorage");
          } else {
            // Se não, faz a requisição e armazena os novos dados no LocalStorage
            localStorage.setItem("products", JSON.stringify(products));
            setProducts(products);
            console.log(products);
          }
        } else {
          // Se não houver dados armazenados, faz a requisição e armazena os dados no LocalStorage
          const { data: products } = await axios.get(
            "http://localhost:3000/products"
          );
          localStorage.setItem("products", JSON.stringify(products));
          setProducts(products);
          console.log(products);
          console.log("Não há dados armazenados no LocalStorage");
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <input type="text" placeholder="Search..." />
      <button>Search</button>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.nome}</h2>
          <p>{product.description}</p>
          <p>{product.price}</p>
        </div>
      ))}
    </>
  );
}

export default App;
