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
        return resolve(rows);
      });
    });
  }

  transaction(query1, query2) {
    return new Promise((resolve, reject) => {
      this.connection.beginTransaction((err1) => {
        if (err1) { return reject(err1); }

        this.connection.query(query1, (err2) => {
          if (err2) { return reject(err2); }

          this.connection.query(query2, (err3) => {
            if (err3) { return reject(err3); }
            this.connection.commit();
            return resolve();
          })
        })
      })
    });
  }

  close() {
    this.connection.close();
  }
}

module.exports = Database;
