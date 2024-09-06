const mongoose = require("mongoose");

const ticketCollection = "ticket";

const ticketSchema = new mongoose.Schema({
  code: { type: String },
  purchase_datetime: { type: String },
  amount: { type: Number },
  purchaser: { type: String },
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

module.exports = ticketModel;
