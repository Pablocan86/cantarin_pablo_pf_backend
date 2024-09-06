const mongoose = require("mongoose");

const tokenCollection = "tokens";

const tokenSchema = new mongoose.Schema({
  token: { type: String },
  email: { type: String },
  expirationTime: { type: String },
});

const tokenModel = mongoose.model(tokenCollection, tokenSchema);

module.exports = tokenModel;
