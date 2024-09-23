const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsCotroller.js");

const {
  isAuthenticated,
  isNotAuthenticated,
  isAdmin,
  isAdminOrPremium,
} = require("../middleware/auth.js");

//Mueestra todos los productos de la base de datos
router.get("/products", productsController.getProducts);

//Muestra detalles del producto por ID
router.get("/productDetails/:pid", productsController.productDetails);

//Vista de los productos del administrador
router.get(
  "/productsManager",
  isAuthenticated,
  isAdminOrPremium,
  productsController.productsAdmin
);

//Crear producto en la base de datos
router.post("/productsManager", productsController.addProductToBD);

//Actualiza producto de la base de datos
router.put("/:uid", productsController.updateProductToDB);

//Vista para actualizar productos
router.get("/updateproducts/:pid", productsController.getUpdateProduct);

//Borra producto de la base de datos
router.delete("/productsManager/:uid", productsController.deleteProductToDB);

module.exports = router;
