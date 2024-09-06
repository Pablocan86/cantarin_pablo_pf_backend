const cartModel = require("../dao/models/cart.model.js");
const productModel = require("../dao/models/product.model.js");

class CartManager {
  constructor() {}

  async addCart() {
    const newCart = new cartModel();
    await cartModel.create(newCart);
    console.log("Carrito creado correctamente");
  }

  //Método para ir agrendo productos a los carritos, el primer parámetro es el id del producto de Products.json
  //el segúndo parámetro es el id del carrito que pretendo agregar el producto
  async addToCart(idP, idC) {
    try {
      //Variable que toma el producto utilizando el método addProduct()
      const cart = await cartModel.findOne({ _id: idC });
      const product = await productModel.findOne({ _id: idP });
      if (!cart) {
        return res.status(404).send({ Respusta: "Carrito no encontrado" });
      }

      if (product) {
        let existProduct = cart.products.find(
          (p) => p.product.toString() === idP
        );
        if (existProduct) {
          existProduct.quantity++;
          let result = await cartModel.updateOne(
            { _id: idC },
            { products: cart.products }
          );
        } else {
          cart.products.push({ product: product, quantity: 1 });
          let result = await cartModel.updateOne({ _id: idC }, cart);
        }
      } else {
        console.log("No existe producto");
      }

      console.log(product, cart);
    } catch (error) {
      console.error("No se puede agregar producto o crear carrito", error);
    }
  }
  //Este metodo agrega producto por id, me sirve para el método de arriba
  async addProduct(id) {
    try {
      const bd = await this.readBD();
      const existProduct = bd.find((prod) => prod.id === id);
      if (existProduct) {
        return existProduct.id;
      } else {
        console.log(`Producto con id: ${id} inexistente`);
      }
    } catch (error) {
      console.error("No existe producto en la base de datos", error);
    }
  }
  async deleteCart(id) {
    let cart = await cartModel.findById(id);

    if (cart) {
      await cartModel.deleteOne({ _id: id });
      console.log("Carrito borrado correctamente");
    } else {
      throw Error("No se encuentra carrito con es id en la base de datos");
    }
  }
}

module.exports = CartManager;
