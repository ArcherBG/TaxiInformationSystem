const express = require('express');
const router = express.Router();
const CarController = require('../controllers/car.controller');
const DriverController = require('../controllers/driver.controller');
const OrderController = require('../controllers/order.controller');
const CompositeController = require('../controllers/composite.controller.js');

module.exports = (app, db) => {
  const carController = new CarController(db);
  const driverController = new DriverController(db);
  const orderController = new OrderController(db);
  const compositeController = new CompositeController(db);

  router
    .get('/api/cars', (req, res) => carController.getCars(req, res))
    .post('/api/cars', (req, res) => carController.createCar(req, res))
    .get('/api/drivers', (req, res) => driverController.getDrivers(req, res))
    .get('/api/orders', (req, res) => orderController.getAll(req, res))
    .put('/api/orders', (req, res) => orderController.update(req, res))
    .post('/api/composite/ordersforcar', (req, res) => compositeController.getAllOrdersAfterDateForRegistrationNumber(req, res))
    .post('/api/composite/mostexperienceddriver', (req, res) => compositeController.getMostExperiencedDriverForCity(req, res))
    .get('/api/composite/tataldrivendistance', (req, res) => compositeController.getTotalDriverDistanceForEveryCar(req, res))
    .get('/api/composite/orderswithinvalidlicense', (req, res) => compositeController.getAllOrdersMadeWithInvalidLicense(req, res))
    .post('/api/composite/totalbillfordriver', (req, res) => compositeController.getTotalBillForDriverByEgn(req, res))

  app.use(router);
};
