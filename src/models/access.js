const BaseModel  = require('./index');

// LINK src/models/index.js#parent
// NOTE inheritance (child)
class AccessModel extends BaseModel {
  constructor() {
    super('access');
    this.select = {
      id: true,
      role_id: true,
      menu_id: true,
      visible: true,
      grant: true,
    };
  }
}

module.exports = AccessModel;