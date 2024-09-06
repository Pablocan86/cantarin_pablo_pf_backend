const mongoose = require("mongoose");

const cartCollection = "carts";

const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number },
        totalPrice: { type: Number },
      },
    ],
    default: [],
  },
  total: { type: Number },
});

const cartsModel = mongoose.model(cartCollection, cartsSchema);

module.exports = cartsModel;
