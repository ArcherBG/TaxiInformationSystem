const OrderData = require('../data/order.data');

class OrderController {
  constructor(database){
    this.orderData = new OrderData(database);
  }

  getAll(req, res) {
    this.orderData.getAll()
      .then(orders => {
        return res.status(200).json(orders);
      });
  }

}

module.exports = OrderController;
