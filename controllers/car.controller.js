class CarController {
  constructor(database) {
    this.database = database;
  }

    getCars(req, res) {
    return res.status(200).json("Endpoint is working" );
  }
}

module.exports = CarController;
