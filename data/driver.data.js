const BaseData = require('./base/base.data');
const dbName = require('../config').databaseName;

class DriverData extends BaseData {

  constructor(database) {
    super();
    this.database = database;
  }

  async init() {
    await this.database.query(
      `CREATE TABLE IF NOT EXISTS ${dbName}.drivers (
        id INT(32) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        egn VARCHAR(20),
        license_valid DATE,
        experience_in_days VARCHAR(50),
        fk_address INT(32) UNSIGNED,
        FOREIGN KEY (fk_address)
        REFERENCES ${dbName}.addresses(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
       )ENGINE=InnoDB;`);

  }

  async getById(id) {
    const query = `SELECT * FROM ${dbName}.drivers WHERE id=${id}`;
    return await this.database.query(query);
  }

  async create(firstName, lastName, egn, licenseValidTo, experienceInDays, city, street, streetNumber) {
    const addressQuery = `INSERT INTO ${dbName}.addresses (
      city, street, street_number
      ) SELECT * FROM (SELECT "${city}", "${street}", "${streetNumber}") as tmp
      WHERE NOT EXISTS (
          SELECT city, street, street_number FROM ${dbName}.addresses WHERE (city="${city}" AND street="${street}" AND street_number="${streetNumber}")
      ) LIMIT 1`;

    const driversQuery = `INSERT INTO ${dbName}.drivers (
      first_name, last_name, egn, license_valid, experience_in_days, fk_address
    ) VALUES (
      "${firstName}", "${lastName}", "${egn}", "${licenseValidTo}", "${experienceInDays}", (SELECT id FROM ${dbName}.addresses WHERE (city="${city}" AND street="${street}" AND street_number="${streetNumber}"))
    )`;
    return await this.database.transaction(addressQuery, driversQuery);
  }


}

module.exports = DriverData;
