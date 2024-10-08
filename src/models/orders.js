const BaseModel = require("./index");

// LINK src/models/index.js#parent
// NOTE inheritance (child)
class OrderModel extends BaseModel {
  constructor() {
    super("orders");
    this.select = {
      id: true,
      car_id: true,
      user_id: true,
      payment_id: false,
      status: true,
      orderNumber: true,
      paymentReceipt: false,
      total: true,
      isDriver: true,
      startTime: true,
      finishTime: true
    };
  }
}

module.exports = OrderModel;
