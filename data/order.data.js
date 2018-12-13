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
        fk_address INT(32) UNSIGNED NOT NULL,
        startTime TIMESTAMP,
        distance INT(32) UNSIGNED DEFAULT 0, 
        bill INT(32) UNSIGNED DEFAULT 0, 
        fk_car INT(32) UNSIGNED NOT NULL,
        fk_driver INT(32) UNSIGNED NOT NULL,
        FOREIGN KEY (fk_address)
        REFERENCES ${dbName}.addresses(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
        FOREIGN KEY (fk_car)
        REFERENCES ${dbName}.cars(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
        FOREIGN KEY (fk_driver)
        REFERENCES ${dbName}.drivers(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
       )ENGINE=InnoDB;`);
  }

  async getAll(){
    const query = `SELECT *, ${dbName}.orders.id as 'orderId'  FROM ${dbName}.orders
      INNER JOIN ${dbName}.addresses ON ${dbName}.orders.fk_address=${dbName}.addresses.id
      INNER JOIN ${dbName}.drivers ON ${dbName}.orders.fk_driver=${dbName}.drivers.id
      INNER JOIN ${dbName}.cars ON ${dbName}.orders.fk_car=${dbName}.cars.id`;
      return await this.database.query(query);
  }

  async getById(id) {
    const query = `SELECT * FROM ${dbName}.orders WHERE id=${id}`;
    return await this.database.query(query);
  }

  async create(city, street, streetNumber, startTime = new Date().toISOString().slice(0, 19).replace('T', ' '), distance = 0, bill = 0, registrationNumber, driverEgn){
    const addressQuery = `INSERT INTO ${dbName}.addresses (
      city, street, street_number
      ) SELECT * FROM (SELECT "${city}", "${street}", "${streetNumber}") as tmp
      WHERE NOT EXISTS (
          SELECT city, street, street_number FROM ${dbName}.addresses WHERE (city="${city}" AND street="${street}" AND street_number="${streetNumber}")
    ) LIMIT 1`;

    const ordersQuery = `INSERT INTO ${dbName}.orders (
      fk_address, startTime, distance, bill, fk_car, fk_driver
      ) VALUES (
        (SELECT id FROM ${dbName}.addresses WHERE (city="${city}" AND street="${street}" AND street_number="${streetNumber}")), 
        "${startTime}", ${distance}, ${bill},
        (SELECT id FROM ${dbName}.cars WHERE (registration_number="${registrationNumber}")),
        (SELECT id FROM ${dbName}.drivers WHERE (egn="${driverEgn}"))
    )`;
    return await this.database.transaction(addressQuery, ordersQuery);
  }

}

module.exports = OrderData;
