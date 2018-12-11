const BaseData = require('./base/base.data');
const dbName = require('../config').databaseName;

class Address extends BaseData {
  constructor(database) {
    super();
    this.database = database;
  }

  async init() {
    await this.database.query(
      `CREATE TABLE IF NOT EXISTS ${dbName}.addresses (
        id INT(32) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        city VARCHAR(255),
        street VARCHAR(255),
        street_number VARCHAR(50)
    )`);
  }

  async getById(id) {
    const query = `SELECT * FROM ${dbName}.addresses WHERE id=${id}`;
    return await this.database.query(query);
  }

  async create(city, street, number) {
    const query = `INSERT INTO ${dbName}.addresses (
      city, street, street_number
      ) VALUES (
        "${city}", "${street}", "${number}"
      )`;
      return await this.database.query(query);
  }
} 

module.exports = Address;
