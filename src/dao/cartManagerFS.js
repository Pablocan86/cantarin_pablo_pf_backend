const { writeFile, utimes } = require("fs");

const fs = require("fs").promises;

class CartManager {
  constructor() {
    //Obtengo datos del archivo Carts.json
    this.cartsFile = "./preEntrega1_Cantarin_Backend/src/Carts.json";
    //Obtengo datos del archivo Products.json para no tener que instanciar la clase ProductManager por eso solo
    this.productsBD = "./preEntrega1_Cantarin_Backend/src/Products.json";
  }

  //Método para crear la estructura de un carrito en el archivo Carts.json
  async creatCart() {
    try {
      //Leo el json de carritos
      const carts = await this.readCart();
      //Creo un id que no se repita buscando último id de json
      const ultimoId =
        carts.length > 0 ? Math.max(...carts.map((prod) => prod.id)) : 0;
      //Objeto que se va a agregear
      const carrito = {
        id: ultimoId + 1,
        products: [],
      };
      //Busco si existe el carrito
      const existCart = carts.find((cart) => cart.id === carrito.id);
      //Validación para agregar un nuevo carrito si no existe y si existe no se crea
      if (!existCart) {
        carts.push(carrito);
        fs.writeFile(this.cartsFile, JSON.stringify(carts, null, 2));
        console.log("Se ha creado un nuevo 🛒");
      }
      if (existCart) {
        console.error("Ya existe el 🛒", error);
      }
    } catch (error) {
      console.error("No se puede crear el 🛒");
    }
  }
  //Método para obtener lista de productos del carrito que tiene  el id que le paso como parámetro
  async getProductsForCart(id) {
    try {
      //Variable con todos los carritos
      const carts = await this.readCart();
      //Busco si existe el carrito
      const existCart = carts.find((cart) => cart.id === id);
      //Validación si existe carrito muestro productos, sino mensaje de no existe.
      if (existCart) {
        return existCart.products;
      } else {
        return console.log("No existe 🛒");
      }
    } catch (error) {
      console.error("No se puede crear el 🛒");
    }
  }

  //Método para ir agrendo productos a los carritos, el primer parámetro es el id del producto de Products.json
  //el segúndo parámetro es el id del carrito que pretendo agregar el producto
  async addToCart(idP, idC) {
    try {
      //Variable que toma el producto utilizando el método addProduct()
      const product = await this.addProduct(idP);
      //Variables que contiene todos los carritos
      const carts = await this.readCart();
      //Busco si existe el carrito
      const existCart = carts.find((cart) => cart.id === idC);
      //Validación para crear un carrito si no existe, si existe agrega productos a ese carrito
      //y si existe producto suma cantidad
      if (!existCart) {
        //Variable que me permite no repetir los id
        const ultimoId =
          carts.length > 0 ? Math.max(...carts.map((cart) => cart.id)) : 0;
        //Estruvtura del nuevo carrito
        const newCart = {
          id: idC || ultimoId + 1,
          products: [{ product: product, quantity: 1 }],
        };
        carts.push(newCart);
        await fs.writeFile(this.cartsFile, JSON.stringify(carts, null, 2));
      }
      //Caso en el que existe el carrito
      if (existCart) {
        //Busco indice del carrito existente
        const cartIndex = carts.findIndex((cart) => cart.id === idC);
        //Busco si existe el producto en ese carrito existente
        const existingProductIndex = carts[cartIndex].products.findIndex(
          (prod) => prod.product === idP
        );
        //Si carrito tiene producto le sumo la cantidad, sino crea otro objeto de producto y cantidad
        if (existingProductIndex !== -1) {
          carts[cartIndex].products[existingProductIndex].quantity++;
        } else {
          carts[cartIndex].products.push({ product: product, quantity: 1 });
        }
        await fs.writeFile(this.cartsFile, JSON.stringify(carts, null, 2));
      }
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
  //Lectura del archivo Products.json
  async readBD() {
    try {
      const bd = await fs.readFile(this.productsBD, "utf8");
      const products = JSON.parse(bd);
      return products;
    } catch (error) {
      console.error("No se puede acceder al archivo de los productos", error);
    }
  }
  //Lectura del archivo Carts.json
  async readCart() {
    try {
      const cart = await fs.readFile(this.cartsFile, "utf8");
      const productsInCart = JSON.parse(cart);
      return productsInCart;
    } catch (error) {
      console.error("No se puede acceder al archivo del carrito", error);
    }
  }
}

//Dejo instancia de clase CartManager por si se quiere probar desde este archivo
//const cartManager = new CartManager();
module.exports = CartManager;
