const BaseData = require('./base/base.data');
const dbName = require('../config').databaseName;

class CarData extends BaseData {

  constructor(database) {
    super();
    this.database = database
  }

  async init() {
    await this.database.query(
      `CREATE TABLE IF NOT EXISTS ${dbName}.cars (
        id INT(32) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        taxi_number VARCHAR(50),
        registration_number VARCHAR(50),
        brand VARCHAR(255),
        model VARCHAR(255),
        passenger_seats INT UNSIGNED DEFAULT 0,
        big_boot VARCHAR(10) DEFAULT "FALSE",
        mot_expiration DATE
        )`);
      }

  async getById(id) {
    const query = `SELECT * FROM ${dbName}.cars WHERE id=${id}`;
    return await this.database.query(query);
  }

  async create(taxiNumber, registrationNumber, brand, model, passengerSeats, bigBoot, MOTValidTo) {
    const query = `INSERT INTO ${dbName}.cars (
      taxi_number, registration_number, brand, model, passenger_seats, big_boot, mot_expiration
      ) VALUES (
      "${taxiNumber}", "${registrationNumber}", "${brand}", "${model}", "${passengerSeats}", ${bigBoot}, "${MOTValidTo}"
      )`;
    return await this.database.query(query);
  }

}

module.exports = CarData;
