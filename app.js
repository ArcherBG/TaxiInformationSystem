const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const CONFIG = require('./config');
const Database = require('./db/Database');
const CarData = require('./data/car.data');
const AddressData = require('./data/address.data');
const DriverData = require('./data/driver.data');
const OrderData = require('./data/order.data');
const CarController = require('./controllers/car.controller');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');
var debug = require('debug')('taxiinformationsystem:server');
var http = require('http');

const db = new Database();

async function dbDrop() {
  const dropSchema = `  DROP DATABASE IF EXISTS ${CONFIG.databaseName};`;
  await db.query(dropSchema);
}

// Create database 
async function dbInit() {
  const createSchema = `CREATE DATABASE IF NOT EXISTS ${CONFIG.databaseName}`;
  await db.query(createSchema);
}

// Populate db with some values
async function populateDb() {
  // Populate cars table
  const carData = new CarData(db);
  await carData.init();
  await carData.create("1000", "B5555CH", "Mercedes", "S500", 4, "TRUE", "2000-11-12");
  await carData.create("1100", "CA7494PT", "Mercedes", "C220", 4, "TRUE", "2019-01-02");
  await carData.create("1015", "H8726KA", "BMW", "330", 3, "FALSE", "2021-08-20");
  await carData.create("1112", "A3050CM", "Mitsubishi", "Grandis", 6, "TRUE", "2020-07-14");
  await carData.create("2000", "BT8715XP", "Open", "Zafira", 6, "TRUE", "2022-04-18");
  await carData.create("1398", "C1672TT", "Open", "Astra", 4, "FALSE", "2018-12-12");
  await carData.create("1428", "PB8712OM", "Toyota", "Yaris", 3, "FALSE", "2019-03-25");
  await carData.create("3100", "P0324AB", "Nissan", "Patrol", 6, "TRUE", "2022-04-10");
  await carData.create("3800", "A3971EA", "Citroen", "C5", 5, "TRUE", "2020-07-11");
  await carData.create("2490", "P3652HH", "Citroen", "C4", 4, "FALSE", "2020-08-01");

  // Populate address table
  const addressData = new AddressData(db);
  await addressData.init();
  await addressData.create("Varna", "Slivnica", "120");
  await addressData.create("Varna", "Studentska", "3");
  await addressData.create("Sofia", "Cherni Vruh", "25");
  await addressData.create("Sofia", "Tsar Osvoboditel", "18");
  await addressData.create("Varna", "Tsar Osvoboditel", "30");
  await addressData.create("Varna", "Maria Luiza", "73");
  await addressData.create("Varna", "Vasil Levski", "55");
  await addressData.create("Varna", "Vladislav Varnenchik", "10");
  await addressData.create("Sofia", "Vitosha", "1");
  await addressData.create("Sofia", "Vitosha", "70");

  // Populate Drivers table
  const driverData = new DriverData(db);
  await driverData.init();
  await driverData.create("John", "Snow", "8811024862", "2019-10-10", "4000", "Varna", "Kraiezerna", "5");
  await driverData.create("Jack", "Sparrow", "751210813", "2018-10-10", "300", "Varna", "Tsar Osvoboditel", "20");
  await driverData.create("George", "Pasqualev", "751219999", "2021-03-05", "440", "Sofia", "Vitosha", "70");
  await driverData.create("Ana", "Hansen", "9012364787", "2020-01-06", "500", "Varna", "Vladislav Varnenchik", "10");
  await driverData.create("Robin", "Santa", "6504096413", "2020-02-01", "120", "Varna", "Bulair", "74");
  await driverData.create("Julia", "Jolie", "8612031846", "2018-12-10", "670", "Sofia", "Vitosha", "26");
  await driverData.create("Trevor", "Phillips", "6006047419", "2022-10-10", "8740", "Sofia", "Vitosha", "48");
  await driverData.create("Nikolay", "Asenov", "7510038484", "2021-11-09", "200", "Varna", "Maria Luiza", "20");
  await driverData.create("Ivan", "Ivanov", "9214013381", "2020-11-02", "300", "Varna", "Studentska", "22");
  await driverData.create("Sam", "Smith", "7784449130", "2020-10-04", "1000", "Varna", "Vasil Levski", "130");

  // Populate Orders table
  const orderData = new OrderData(db);
  await orderData.init();
  await orderData.create("Varna", "Maria Luiza", "32", "2018-12-11 17:02:51", 12, 20, "B5555CH", 9012364787);
  await orderData.create("Varna", "Studentska", "1", "2018-11-10 18:00:00", 10, 14, "C1672TT", 9012364787);
  await orderData.create("Varna", "Kraiezerna", "240", "2018-12-08 20:00:00", 6, 10, "PB8712OM", 7510038484);
  await orderData.create("Varna", "Vasil Levski", "18", "2018-12-09 06:00:00", 6, 10, "C1672TT", 7784449130);
  await orderData.create("Sofia", "Tsar Osvoboditel", "10", "2018-12-06 23:00:00", 6, 8, "A3050CM", 6006047419);
  await orderData.create("Sofia", "Tsar Osvobodite;", "12", "2018-10-30 02:00:00", 4, 10, "A3050CM", 9214013381);
  await orderData.create("Varna", "Bregalnica", "4", "2018-12-03 10:00:00", 5, 7, "PB8712OM", 9012364787);
  await orderData.create("Varna", "Vladislav Varnenchik", "30", "2018-12-07 07:00:00", 5, 6, "A3050CM", 9214013381);
  await orderData.create("Varna", "8-mi primorski polk", "10", new Date().toISOString().slice(0, 19).replace('T', ' '), 5, 8, "B5555CH", 8612031846);
  await orderData.create("Varna", "Vasil Levski", "144", new Date().toISOString().slice(0, 19).replace('T', ' '), 2, 3, "P3652HH", 7510038484);
}

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(server) {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

dbDrop()
  .then(() => {
    dbInit();
  })
  .then(async () => {
    await populateDb(db);
  })
  .then(() => {
    const app = express();

    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    app.use(logger('dev'));
    app.use(express.json());
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    // Add routes
    apiRouter(app, db);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });

    // Get port from environment and store in Express.
    var port = normalizePort(process.env.PORT || '3000');
    app.set('port', port);

    // Create HTTP server
    var server = http.createServer(app);

    // Listen on provided port, on all network interfaces.
    server.listen(port, () => console.log(`Server is listening on port ${port}!`));
    server.on('error', onError);
    server.on('listening', () => onListening(server));

  })
  .catch(err => console.log("Error: " + err));
