const CarData = require('../data/car.data');

class CarController {
  constructor(database) {
    this.database = database;
    this.carData = new CarData(database);
  }

  getAllCars(req, res) {
    this.carData.getAll()
      .then(cars => {
        return res.status(200).json(cars);
      });
  }

  getCar(req, res) {console.log(req.params.id);
    this.carData.getById(req.params.id)
      .then(response => {
        return res.status(200).json(response);
      })
      .catch(err => {
        return res.status(500).json({ "Error": err });
      });
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
