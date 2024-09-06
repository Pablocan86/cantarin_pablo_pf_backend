const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const productCollection = "products";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, max: 30 },
  description: { type: String, required: true, max: 50 },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  code: { type: String, required: true, max: 6 },
  status: { type: Boolean, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  owner: { type: String, default: "admin" },
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

module.exports = productModel;
