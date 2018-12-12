const CarData = require('../data/car.data');

class CarController {
  constructor(database) {
    this.carData = new CarData(database);
  }

  getCars(req, res) {
    if (req.query.id || req.query.regNum) {
      return this.getCar(req, res);
    } else {
      this.carData.getAll()
        .then(cars => {
          return res.status(200).json(cars);
        });
    }
  }

  getCar(req, res) {
    if (req.query.id) {
      this.carData.getCar("id", req.query.id)
        .then(response => {
          return res.status(200).json(response);
        })
        .catch(err => {
          return res.status(500).json({ "Error": err });
        });
    } else if (req.query.regNum) {
      this.carData.getCar("registration_number", req.query.regNum)
        .then(response => {
          return res.status(200).json(response);
        })
        .catch(err => {
          return res.status(500).json({ "Error": err });
        });
    } else {
      return res.status(400).json({ "Error": "Unsupported search by criteria" });
    }
  }

  createCar(req, res) {
    const body = req.body;

    // Validate some of the fields
    const taxiNumber = body.taxiNumber;
    if (taxiNumber == null || taxiNumber === undefined || taxiNumber.length < 1 || taxiNumber.length > 50) {
      return res.status(400).json({ "Error": "Taxi number must be between 1 and 50" });
    }
    const regNumber = body.registrationNumber;
    if (regNumber == null || regNumber === undefined || regNumber.length < 1 || regNumber.length > 50) {
      return res.status(400).json({ "Error": "Registration number must be between 1 and 50" });
    }
    const seats = Number.parseInt(body.passengerSeats, 10);
    if (seats < 3 || seats > 10) {
      return res.status(400).json({ "Error": "Passenger seats must be between 3 and 10" });
    }

    this.carData.create(body.taxiNumber, body.registrationNumber, body.brand, body.model, body.passengerSeats, body.bigBoot, body.motExpiration)
      .then(result => {
        return res.status(200).json({ "id": result.insertId });
      })
      .catch(err => {
        return res.status(500).json({ "Error": err });
      });
  }
}

module.exports = CarController;
