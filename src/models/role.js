const BaseModel  = require('./index');

// LINK src/models/index.js#parent
// NOTE inheritance (child)
class RoleModel extends BaseModel {
  constructor() {
    super('roles');
    this.select = {
      id: true,
      role: true,
    };
  }
}

module.exports = RoleModel;