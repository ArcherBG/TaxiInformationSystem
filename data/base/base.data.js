const { Database } = require("../../db/Database");

class BaseData {

  create() {
    throw 'Method not implemented';
  }

  getById() {
    throw 'Method not implemented';
  }

  getAll() {
    throw 'Method not implemented';
  }

  update() {
    throw 'Method not implemented';
  }

  delete() {
    throw 'Method not implemented';
  }
}

module.exports = BaseData;
