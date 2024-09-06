const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsCotroller.js");

const {
  isAuthenticated,
  isNotAuthenticated,
  isAdmin,
  isAdminOrPremium,
} = require("../middleware/auth.js");

router.get("/mockingproducts", productsController.mockingProducts);

router.get("/products", productsController.getProducts);

router.get("/productDetails/:pid", productsController.productDetails);

router.get(
  "/productsManager",
  isAuthenticated,
  isAdminOrPremium,
  productsController.productsAdmin
);

router.post("/productsManager", productsController.addProductToBD);

router.put("/:uid", productsController.updateProductToDB);

router.get("/updateproducts/:pid", productsController.getUpdateProduct);

router.delete("/productsManager/:uid", productsController.deleteProductToDB);

module.exports = router;
