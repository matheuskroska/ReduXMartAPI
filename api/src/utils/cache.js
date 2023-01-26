const getCacheProducts = () => {
  return new Promise((resolve, reject) => {
    client.get("products", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

const setCacheProducts = (products) => {
  client.set("products", JSON.stringify(products));
};
