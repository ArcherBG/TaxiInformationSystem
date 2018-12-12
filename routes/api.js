const express = require('express');
const router = express.Router();
const CarController = require('../controllers/car.controller');

module.exports = (app, db) => {
  const carController = new CarController(db);
  
  router
    .get('/api/cars', (req, res) => carController.getCars(req, res))

  app.use(router);
};
