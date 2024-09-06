const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController.js");

router.get("/", cartController.getcarts);

router.get("/:cid/purchase", cartController.checkout);

router.post("/:cid/purchase", cartController.buy);

router.post("/createcart", cartController.addCart);

router.get("/:cid", cartController.getCartById);

router.post("/:cid/products/:pid", cartController.addToCart);

router.put("/:cid/products/:pid", cartController.addToCartPut);

router.delete("/:cid/products/:pid", cartController.deleteProduct);

module.exports = router;
