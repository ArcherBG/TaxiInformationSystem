const DriverData = require('../data/driver.data');

class DriverController {
  constructor(database) {
    this.driverData = new DriverData(database);
  }

  getDrivers(req, res) {
    if (req.query.egn) {
      return this.getDriverByEgn(req, res);
    }
    this.driverData.getAll()
      .then(drivers => {
        return res.status(200).json(drivers);
      });
  }

  getDriverByEgn(req, res) {
    if (req.query.egn) {
      this.driverData.getBy("egn", req.query.egn)
        .then(driver => {
          return res.status(200).json(driver);
        });
    } else {
      return res.status(400).json({ "Error": "Unsupported search by criteria" });
    }
  }

}

module.exports = DriverController;
