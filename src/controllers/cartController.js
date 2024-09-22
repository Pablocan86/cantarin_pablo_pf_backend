const cartManager = require("../dao/classes/cart.dao.js");
const cartModel = require("../dao/models/cart.model.js");
const productManager = require("../dao/classes/product.dao.js");
const productModel = require("../dao/models/product.model.js");
const userManager = require("../dao/classes/user.dao.js");
const crypto = require("crypto");
const ticketManager = require("../dao/classes/ticket.dao.js");
const { transport } = require("../middleware/mailer.js");
const { devLogger, prodLogger } = require("../middleware/logger.js");

const cartService = new cartManager();
const productService = new productManager();
const ticketService = new ticketManager();
const userService = new userManager();

exports.getcarts = async (req, res) => {
  try {
    let carts = await cartService.getCarts();
    res.send({ result: "success", payload: carts });
  } catch (error) {
    devLogger.info("No se encuentran carritos en la base de datos");
    prodLogger.info("No se encuentran carritos en la base de datos" + error);
  }
};

exports.addCart = async (req, res) => {
  try {
    await cartService.addCart();
    let carts = await cartService.getCarts();
    console.log("Carrito creado correctamente");
    res.status(200).json("Carrito creado");
  } catch (error) {
    res.status(505).json("Error al crear el carrito");
  }
};

exports.getCartById = async (req, res) => {
  let { cid } = req.params;
  const user = req.session.user;
  try {
    let cart = await cartService.getCartByIdPopulate(cid);
    let cartSimple = await cartService.getCartById(cid);
    res.render("cart", {
      cart,
      user: user,
      totalPrice: cartSimple.total,
      style: "cart.css",
      title: "Carrito",
    });
  } catch (error) {
    devLogger.info("Carrito inexistente: " + error);
    res.status(500).send("Error al obtener el carrito");
  }
};

exports.addToCart = async (req, res) => {
  let { cid, pid } = req.params;
  let user = req.session.user;
  let product = await productService.getProductById(pid);

  try {
    if (user.email === product.owner) {
      return res
        .status(202)
        .json({ message: "No se puede agregar un producto suyo" });
    }
    if (user.rol === "admin") {
      devLogger.info(
        "Rol de administador, no puede agregar productos al carrito"
      );
      return res.redirect("/products");
    }

    if (user.rol === "user" || user.rol === "premium") {
      await cartService.addToCart(pid, cid);
      return res.redirect("/products");
    }
    return res.redirect("/products");
  } catch (error) {
    prodLogger.error("Imposibilidad de agregar productos al cerrito: " + error);
    return res.status(500).send("Error de conexión");
  }
};

exports.addToCartProductDetails = async (req, res) => {
  let { cid, pid } = req.params;
  let user = req.session.user;
  let product = await productService.getProductById(pid);

  try {
    if (user.email === product.owner) {
      return res
        .status(202)
        .json({ message: "No se puede agregar un producto suyo" });
    }
    if (user.rol === "admin") {
      devLogger.info(
        "Rol de administador, no puede agregar productos al carrito"
      );
      return res.redirect(`/productsDetails/${cid}`);
    }

    if (user.rol === "user" || user.rol === "premium") {
      await cartService.addToCart(pid, cid);
      return res.redirect(`/productDetails/${pid}`);
    }
    return res.redirect(`/productDetails/${pid}`);
  } catch (error) {
    prodLogger.error("Imposibilidad de agregar productos al cerrito: " + error);
    return res.status(500).send("Error de conexión");
  }
};

exports.addToCartPut = async (req, res) => {
  let { cid, pid } = req.params;
  let user = req.session.user;
  let product = await productService.getProductById(pid);

  try {
    if (user.email === product.owner) {
      return res
        .status(202)
        .json({ message: "No se puede agregar un producto suyo" });
    }
    if (user.rol === "admin") {
      devLogger.info(
        "Rol de administador, no puede agregar productos al carrito"
      );
      return res.status(202).json({
        message: "El administrador no puede agregar productos al carrito",
      });
    }

    if (user.rol === "user" || user.rol === "premium") {
      await cartService.addToCart(pid, cid);
      return res.status(201).json({ message: "Cantidad agregada" });
    }
    res.redirect(`/carts/${cid}`);
  } catch (error) {
    prodLogger.error("Imposibilidad de agregar productos al cerrito: " + error);
    return res.status(500).send("Error de conexión");
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    let { cid, pid } = req.params;
    const cart = await cartService.getCartById(cid);
    const product = await productService.getProductById(pid);
    if (!cart) {
      return res.status(404).send({ Respusta: "Carrito no encontrado" });
    }
    let existProduct = cart.products.find((p) => p.product.toString() === pid);
    if (!existProduct) {
      return res
        .status(404)
        .send({ Respuesta: "Producto no encontrado en el carrito" });
    } else {
      if (existProduct.quantity >= 1) {
        existProduct.quantity--;
        existProduct.totalPrice = existProduct.quantity * product.price;
        cart.total = cart.total - product.price;
        let result = await cartModel.updateOne(
          { _id: cid },
          { products: cart.products }
        );
        if (existProduct.quantity === 0) {
          cart.products = cart.products.filter(
            (p) => p.product.toString() !== pid
          );
        }

        await cart.save();

        return res.status(201).json({ message: "Cantidad eliminada" });
      }
    }

    res.redirect(`/carts/${cid}`);
  } catch (error) {
    res.status(504).send(error);
  }
};

exports.checkout = async (req, res) => {
  try {
    let { cid } = req.params;
    const user = req.session.user;
    let productStock = [];
    let productNoStock = [];
    let total = 0;
    let finalyCart = await cartService.getCartById(cid);
    let cart = await cartService.getCartByIdPopulate(cid);
    let products = await productService.getProducts();
    for (const product of cart.products) {
      if (product.product.stock >= product.quantity) {
        productStock.push({
          title: product.product.title,
          quantity: product.quantity,
        });
        total = total + product.totalPrice;
      } else {
        productNoStock.push({ title: product.product.title });
      }
    }
    res.render("checkout", {
      ProductosConStock: productStock,
      ProductosSinStock: productNoStock,
      user: user,
      id: cid,
      total: total,
      title: "Solo un paso más",
      style: "cart.css",
    });
  } catch (error) {
    res.status(504).send(error);
  }
};

exports.buy = async (req, res) => {
  let { cid } = req.params;
  let cart = await cartService.getCartByIdPopulate(cid);
  let user = req.session.user;
  let productStock = [];
  let productNoStock = [];
  let total = 0;

  for (const product of cart.products) {
    if (product.product.stock >= product.quantity) {
      productStock.push({
        title: product.product.title,
        quantity: product.quantity,
      });
      const productId = product._id;
      let newStock = product.product.stock - product.quantity;
      total = total + product.totalPrice;

      cart.total = cart.total - product.totalPrice;
      await productService.updateQuantity(product.product._id, newStock);
      await cartService.updateTotal(cid, cart.total);
      await cartService.updateCart(cid, productId);
    } else {
      productNoStock.push({ title: product.product.title });
    }
  }

  //CREAR TICKET
  let codeCrypto = `${req.session.user.last_name}_${crypto
    .randomBytes(10)
    .toString("hex")}`;
  let code = codeCrypto;
  let date = new Date();
  const formatDate = date.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  let ticket = {
    code: code,
    purchase_datetime: formatDate,
    amount: total,
    purchaser: req.session.user.email,
    products: productStock,
  };
  let mail = await transport.sendMail({
    from: "pablo.cantarin86@gmail.com",
    to: req.session.user.email,
    subject: "Gracias por tu compra",
    html: `<div>
          <h1>Orden # ${ticket.code}</h1>
          <p>Total de compra $ ${ticket.amount}.-</p>
          <p>Gracias por su compra</p>
          </div>`,
  });
  let result = await ticketService.createTicket(ticket);
  res.render("yourPurchase", {
    ticket: ticket,
    products: productStock,
    productNoStock: productNoStock,
    user: user,
    title: "Tu pedido",
    style: "cart.css",
  });
};
