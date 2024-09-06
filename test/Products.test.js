const mongoose = require("mongoose");
const Product = require("../src/dao/classes/product.dao.js");
const Assert = require("assert");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGO_URL);

const assert = Assert.strict;

describe(`Testing Product Dao`, () => {
  before(function () {
    this.productsDao = new Product();
  });
  it(`El Dao debe poder obtener los productos en formato de arreglo`, async function () {
    console.log(this.productsDao);
    const result = await this.productsDao.getProducts();
    assert.strictEqual(Array.isArray(result), true);
  });
  it(`EL Dao debe poder agregar un producto a la base de datos`, async function () {
    console.log(this.productsDao);
    let newProduct = {
      title: "Sandalias amarillas",
      description: "Para salir a veranear",
      price: 15000,
      thumbnail: "dfsdfs",
      code: "SUC307",
      status: true,
      category: "CALZADO",
      stock: 20,
      owner: "admin",
    };

    const result = await this.productsDao.addProduct(
      newProduct.title,
      newProduct.description,
      newProduct.price,
      newProduct.thumbnail,
      newProduct.code,
      newProduct.status,
      newProduct.category,
      newProduct.stock,
      newProduct.owner
    );
    console.log(result);
    assert.ok();
  });
  beforeEach(function () {
    this.timeout(10000);
  });
});
