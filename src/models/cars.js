const BaseModel  = require('./index');

// LINK src/models/index.js#parent
// NOTE inheritance (child)
class CarModel extends BaseModel {
  constructor() {
    super('cars');
    this.select = {
      id: true,
      name: true,
      year: true,
      manufacturer: true,
      price: true,
      img: true,
      baggage: true,
      seat: true,
      description: true
    };
  }
}

module.exports = CarModel;