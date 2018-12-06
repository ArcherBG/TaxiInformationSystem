const mysql = require('mysql');
const Config = require('../config');

const dbConnector = mysql.createConnection(Config.mysqlConnectionObject);

module.exports = dbConnector;