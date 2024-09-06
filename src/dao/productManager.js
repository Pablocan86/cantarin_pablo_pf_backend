const productModel = require("../dao/models/product.model.js");

class ProductManager {
  constructor() {}

  async getProducts() {
    const products = await productModel.find().lean();
    return products;
  }

  async getProductById(pid) {
    const product = await productModel.findById(pid).lean();
    return product;
  }

  async addProduct(
    title,
    description,
    price,
    thumbnail,
    code,
    status,
    category,
    stock
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
      throw new Error("Número de código existente");
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
    });
    return console.log("Producto Agregado correctamente");
  }

  async updateProduct(
    id,
    title,
    description,
    price,
    thumbnail,
    code,
    status,
    category,
    stock
  ) {
    const products = await productModel.find();
    const productoEncontrado = products.find((prod) => prod.id === id);
    if (!productoEncontrado) {
      throw Error("Producto no existe en la base de datos");
    }
    //Creo el objeto nuevo para agregar con las opciones para que no se borre ninguna propiedad de no pasarla como parámetro
    const productoActualizado = {
      title: title || productoEncontrado.title,
      description: description || productoEncontrado.description,
      price: price || productoEncontrado.price,
      thumbnail: thumbnail || productoEncontrado.thumbnail,
      code: code || productoEncontrado.code,
      status: productoEncontrado.status,
      category: category || productoEncontrado.category,
      stock: stock || productoEncontrado.stock,
    };

    await productModel.updateOne({ _id: id }, productoActualizado);
  }

  async deleteProduct(id) {
    const products = await productModel.find();
    const exist = products.find((prod) => prod.id === id);
    if (exist) {
      await productModel.deleteOne({ _id: id });
      console.log("Producto borrado correctamente");
    } else {
      throw Error("No se encuentra producto con es id en la base de datos");
    }
  }
}

module.exports = ProductManager;
