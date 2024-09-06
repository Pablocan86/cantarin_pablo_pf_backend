const cartModel = require("../models/cart.model");
const productModel = require("../models/product.model");
const ticketModel = require("../models/ticket.model");

class TicketManager {
  constructor() {}

  async getTicketById(tid) {
    const ticket = await ticketModel.findById(tid);
    return ticket;
  }

  async createTicket(ticket) {
    const newTicket = await ticketModel.create(ticket);
    return newTicket;
  }
}

module.exports = TicketManager;
