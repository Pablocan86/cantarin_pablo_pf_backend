const chai = require("chai");
const supertest = require("supertest");

const expect = chai.expect;

//URL / endpoints
const requester = supertest(`http://localhost:8080`);

describe("Test ecommerce"),
  () => {
    describe("Test Product Dao", () => {
      it(`El endopint GET /products debe devolver un arreglo de todos los productos`, async () => {
        console.log(this.productsDao);
        const result = await this.productsDao.getProducts();
        assert.strictEqual(Array.isArray(result), true);
      });
    });
  };
