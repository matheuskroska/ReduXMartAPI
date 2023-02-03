const request = require("supertest");
const app = require("../routes/productsRoute.js");
const dataUtils = require("../utils/dataUtils.js");

describe("GET /products", () => {
  it("should return an object with products and links", async () => {
    const res = await request(app).get("/products");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Products fetched successfully");
    expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("links");
    expect(res.body.links).toHaveLength(3);
    expect(res.body.links[0]).toHaveProperty("rel", "self");
    expect(res.body.links[0]).toHaveProperty("href");
    expect(res.body.links[1]).toHaveProperty("rel", "next");
    expect(res.body.links[1]).toHaveProperty("href");
    expect(res.body.links[2]).toHaveProperty("rel", "prev");
    expect(res.body.links[2]).toHaveProperty("href");
  });
});

describe("GET /products route with limit", () => {
  it("should return an object with limited number of products and links", async () => {
    const response = await request(app).get("/products?limit=3");

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveLength(3);
  });

  it("should return a 400 error when an invalid limit is passed", async () => {
    const response = await request(app).get("/products?limit=abc");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid limit");
  });

  it("should return 400 error when limit is a negative number", async () => {
    const response = await request(app).get("/products?limit=-1");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid limit");
  });

  it("should return 400 error when limit is zero", async () => {
    const response = await request(app).get("/products?limit=0");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid limit");
  });

  it("should return 400 when limit is above 100 ", async () => {
    const response = await request(app).get("/products?limit=101");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid limit");
  });

  it("should return 400 error when limit is a small number", async () => {
    const response = await request(app).get("/products?limit=0.5");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid limit");
  });
});

describe("GET /products route with offset", () => {
  it("should return an object with index range [ offset + 10 ]", async () => {
    const response = await request(app).get("/products?offset=50");

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveLength(10);
    response.body.data.forEach((product, index) => {
      expect(product.id).toBe(index + 51);
    });
  });

  it("should return an object with index range [ offset + 10 ]", async () => {
    const response = await request(app).get("/products?offset=0");

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveLength(10);
  });

  it("should return a 400 error when an invalid offset of type 'abc' is passed", async () => {
    const response = await request(app).get("/products?offset=abc");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid offset");
  });

  it("should return a 400 error when an invalid offset of value -1 is passed", async () => {
    const response = await request(app).get("/products?offset=-1");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid offset");
  });

  it("should return a 400 error when an invalid offset of value 1.5 is passed", async () => {
    const response = await request(app).get("/products?offset=1.5");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid offset");
  });

  it("should return a 400 error when an invalid offset of value -123456 is passed", async () => {
    const response = await request(app).get("/products?offset=-123456");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid offset");
  });
});

describe("GET /products route with limit and offset", () => {
  it("should return an object with limited number of products and links", async () => {
    const response = await request(app).get("/products?limit=3&offset=50");

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveLength(3);
    response.body.data.forEach((product, index) => {
      expect(product.id).toBe(index + 51);
    });
  });

  it("should return a 400 error when limit is not a number", async () => {
    const response = await request(app).get("/products?offset=50&limit=abc");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid limit");
  });

  it("should return a 400 error when limit is negative", async () => {
    const response = await request(app).get("/products?offset=50&limit=-3");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid limit");
  });

  it("should return a 400 error when limit is zero", async () => {
    const response = await request(app).get("/products?offset=50&limit=0");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid limit");
  });

  it("should return a 400 error when limit is above 100", async () => {
    const response = await request(app).get("/products?offset=50&limit=101");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid limit");
  });

  it("should return a 400 error when limit is a fractional number", async () => {
    const response = await request(app).get("/products?offset=50&limit=0.5");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid limit");
  });

  it("should return a 400 error when offset is not a number", async () => {
    const response = await request(app).get("/products?offset=abc&limit=3");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid offset");
  });

  it("should return a 400 error when offset is negative", async () => {
    const response = await request(app).get("/products?offset=-50&limit=3");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid offset");
  });

  it("should return a 400 error when offset is a fractional number", async () => {
    const response = await request(app).get("/products?offset=50.5&limit=3");

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Invalid offset");
  });
});
