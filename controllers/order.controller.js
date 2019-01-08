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

  update(req, res) {
    if (req.body.id && req.body.distance && req.body.bill) {
      this.orderData.update(req.body.id, req.body.distance, req.body.bill)
        .then(driver => {
          return res.status(200).json(driver);
        });
    } else {
      return res.status(400).json({ "Error": "Id, distance or bill are missing" });
    }
  }
}

module.exports = OrderController;
