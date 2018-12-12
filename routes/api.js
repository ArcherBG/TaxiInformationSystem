const express = require('express');
const router = express.Router();
const CarController = require('../controllers/car.controller');

module.exports = (app, db) => {
  const carController = new CarController(db);

  router
    .get('/api/cars', (req, res) => carController.getAllCars(req, res))
    .get('/api/cars/:id', (req, res) => carController.getCar(req, res))
    .post('/api/cars', (req, res) => carController.createCar(req, res))

  app.use(router);
};
