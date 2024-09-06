const { setRandomFallback } = require("bcryptjs");
const productModel = require("../models/product.model.js");

class ProductManager {
  constructor() {}

  async getProductById(pid) {
    const product = await productModel.findById(pid).lean();
    return product;
  }
  async totalProducts(filter) {
    const total = await productModel.countDocuments(filter);
    return total;
  }

  async getProducts() {
    const products = await productModel.find().lean();
    return products;
  }

  async onlyGetProducts() {
    const products = await productModel.find();
    return products;
  }

  async addProduct(
    title,
    description,
    price,
    thumbnail,
    code,
    status,
    category,
    stock,
    owner
  ) {
    const products = await productModel.find();
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      !status ||
      !category ||
      !stock
    ) {
      throw new Error("No se han completado todos los campos");
    }
    if (products.some((p) => p.code === code)) {
      throw new Error(
        `Código de producto ${code} existente en la base de datos`
      );
    }
    const newProduct = await productModel.create({
      title,
      description,
      price,
      thumbnail,
      code,
      status,
      category,
      stock,
      owner,
    });
  }

  async updateProduct(productoActualizado) {
    const product = await productModel.findOne({
      code: productoActualizado.code,
    });

    if (product) {
      await productModel.updateOne(
        { code: productoActualizado.code },
        productoActualizado
      );
    } else {
      throw Error("No se puede actualizar el producto");
    }
  }

  async updateQuantity(id, stock) {
    const actualizaciones = {
      stock: stock,
    };
    await productModel.findByIdAndUpdate(id, actualizaciones);
  }
  async deleteProduct(id) {
    try {
      await productModel.deleteOne({ _id: id });
      return;
    } catch {
      throw Error("No se encuentra producto con es id en la base de datos");
    }
  }
}

module.exports = ProductManager;
