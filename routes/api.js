const express = require('express');
const router = express.Router();
const CarController = require('../controllers/car.controller');
const DriverController = require('../controllers/driver.controller');

module.exports = (app, db) => {
  const carController = new CarController(db);
  const driverController = new DriverController(db);

  router
    .get('/api/cars', (req, res) => carController.getCars(req, res))
    .post('/api/cars', (req, res) => carController.createCar(req, res))
    .get('/api/drivers', (req, res) => driverController.getDrivers(req, res))

  app.use(router);
};
