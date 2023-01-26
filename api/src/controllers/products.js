import { getCache, setCache } from "../utils/cache";

const PROVIDER = "brazilian_provider";
const PROVIDER2 = "european_provider";
const UNAVAILABLE = "unavailable";
const DEFAULT_LIMIT = 10;
let lastId = 0;

const API_URL =
  "http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider";
const API_URL2 =
  "http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider";

const getProducts = async (offset, limit) => {
  let products = await getCache();
  if (!products) {
    products = await fetchProducts();
    setCache(products);
  }
  return products.slice(offset, offset + limit);
};

const fetchProducts = async () => {
  const products1 = await axios.get(API_URL);
  const products2 = await axios.get(API_URL2);
  return [
    ...products1.data.map((p) => transformProduct(p, PROVIDER)),
    ...products2.data.map((p) => transformProduct(p, PROVIDER2)),
  ];
};

const transformProduct = (product, provider) => {
  if (provider === PROVIDER) {
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
  } else if (provider === PROVIDER2) {
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
};
