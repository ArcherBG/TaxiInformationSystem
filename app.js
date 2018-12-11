const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const CONFIG = require('./config');
const Database = require('./db/Database');
const CarData = require('./data/car.data');
const AddressData = require('./data/address.data');
const DriverData = require('./data/driver.data');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
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
  await carData.create("2490", "P3652HH", "Citroen", "C4", 4, "False", "2020-08-01");

  // Populate address table
  const addressData = new AddressData(db);
  await addressData.init();
  await addressData.create("Varna", "Slivnica", "120");
  await addressData.create("Varna", "Studentska", "3");
  await addressData.create("Sofia", "Cherni Vruh", "25");
  await addressData.create("Sofia", "Tsar Osvoboditel", "18");
  await addressData.create("Varna", "Tsar Osvoboditel", "30");
  await addressData.create("Varna", "Mariq Luiza", "73");
  await addressData.create("Varna", "Vasil Levski", "55");
  await addressData.create("Varna", "Vladislav Varnenchik", "10");
  await addressData.create("Sofia", "Vitosha", "1");
  await addressData.create("Sofia", "Vitosha", "70");

  // Populate Drivers table
  const driverData = new DriverData(db);
  await driverData.init();
  await driverData.create("John", "Snow", "8811024862", "2019-10-10", "4000", "Varna", "Kraiezerna", "5");
  const transaction = await driverData.getById(1);
  console.log('transaction: ', transaction);


  // TODO populate   
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
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', indexRouter);
    app.use('/users', usersRouter);

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

