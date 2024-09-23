const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController.js");

//Muestra json de carritos
router.get("/", cartController.getcarts);

//Vista de los productos del carrito en stock y sin stock
router.get("/:cid/purchase", cartController.checkout);

//Si hay en stock, crea ticket y envia correo
router.post("/:cid/purchase", cartController.buy);

//Crea un carrito nuevo
router.post("/createcart", cartController.addCart);

//Muetra carrito por ID
router.get("/:cid", cartController.getCartById);

//Agrega productos al carrito
router.post("/:cid/products/:pid", cartController.addToCart);

//Agrega un producto desde la vista del detalle del producto
router.post(
  "/:cid/products/:pid/productDetails",
  cartController.addToCartProductDetails
);

//Si el producto ya esta en el carrito actualiza cantidad
router.put("/:cid/products/:pid", cartController.addToCartPut);

//Borra de 1 en un 1 la cantidad productos del carrito
router.delete("/:cid/products/:pid", cartController.deleteProduct);

module.exports = router;
