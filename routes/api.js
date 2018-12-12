const express = require('express');
const router = express.Router();
const CarController = require('../controllers/car.controller');
const DriverController = require('../controllers/driver.controller');
const OrderController = require('../controllers/order.controller');

module.exports = (app, db) => {
  const carController = new CarController(db);
  const driverController = new DriverController(db);
  const orderController = new OrderController(db);

  router
    .get('/api/cars', (req, res) => carController.getCars(req, res))
    .post('/api/cars', (req, res) => carController.createCar(req, res))
    .get('/api/drivers', (req, res) => driverController.getDrivers(req, res))
    .get('/api/orders/', (req, res) => orderController.getAll(req, res))
  app.use(router);
};
