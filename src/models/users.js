const BaseModel  = require('./index');

// LINK src/models/index.js#parent
// NOTE inheritance (child)
class UserModel extends BaseModel {
  constructor() {
    super('users');
    this.select = {
      id: true,
      name: true,
      email: true,
      password: true,
      address: true,
      phoneNumber: true,
      role_id: true,
      avatar: true,
    };
  }
}

module.exports = UserModel;