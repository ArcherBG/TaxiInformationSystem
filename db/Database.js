const mysql = require('mysql');
const CONFIG = require('../config');

class Database {

  constructor() {
    this.connection = mysql.createConnection(CONFIG.mysqlConnectionObject);
  }

  /**
   * @param {*} sql 
   * @param {*} args 
   */
  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, rows) => {
        if (err) {
          return reject(err);
        }
        resolve(rows);
      });
    });
  }

  close() {
    this.connection.close();
  }
}

module.exports = Database;
