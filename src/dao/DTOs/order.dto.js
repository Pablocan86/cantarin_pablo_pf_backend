class OrderDTO {
  constructor(order) {
    this.products = order.total;
  }
}

module.exports = OrderDTO;
