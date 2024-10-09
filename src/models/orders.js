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
      status: true,
      orderNumber: true,
      total: true,
      isDriver: true,
      isExpired: true,
      startTime: true,
      finishTime: true,
      users: {
        select: {
          name: true,
          email: true,
          phoneNumber: true,
          address: true
        }
      },
      cars: {
        select: {
          name: true,
          manufacturer: true,
          licenseNumber: true
        }
      }
    };
  }
}

module.exports = OrderModel;
