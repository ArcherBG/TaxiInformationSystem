const BaseData = require('./base/base.data');
const dbName = require('../config').databaseName;

class OrderData extends BaseData {

  constructor(database) {
    super();
    this.database = database;
  }

  async init() {
    await this.database.query(
      `CREATE TABLE IF NOT EXISTS ${dbName}.orders (
        id INT(32) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        fk_address INT(32) UNSIGNED,
        startTime TIMESTAMP,
        distance INT(32) UNSIGNED DEFAULT 0, 
        bill INT(32) UNSIGNED DEFAULT 0, 
        FOREIGN KEY (fk_address)
        REFERENCES ${dbName}.addresses(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
       )ENGINE=InnoDB;`);
  }

  async getById(id) {
    const query = `SELECT * FROM ${dbName}.orders WHERE id=${id}`;
    return await this.database.query(query);
  }

  async create(city, street, streetNumber, startTime, distance = 0, bill = 0){
    const addressQuery = `INSERT INTO ${dbName}.addresses (
      city, street, street_number
      ) SELECT * FROM (SELECT "${city}", "${street}", "${streetNumber}") as tmp
      WHERE NOT EXISTS (
          SELECT city, street, street_number FROM ${dbName}.addresses WHERE (city="${city}" AND street="${street}" AND street_number="${streetNumber}")
    ) LIMIT 1`;

    const ordersQuery = `INSERT INTO ${dbName}.orders (
      fk_address, startTime, distance, bill
      ) VALUES (
        (SELECT id FROM ${dbName}.addresses WHERE (city="${city}" AND street="${street}" AND street_number="${streetNumber}")), 
        "${startTime}", ${distance}, ${bill}
    )`;
    return await this.database.transaction(addressQuery, ordersQuery);
  }

}

module.exports = OrderData;
