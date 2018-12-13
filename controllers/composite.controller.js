
/**
 * TODO: Quick and dirty. Refactor
 * Controller that handles special queries which need to join several db tables
 */
class CompositeController {
  constructor(database) {
    this.database = database;
  }

  getAllOrdersAfterDateForRegistrationNumber(req, res) {
    const body = req.body;
    const { date, registrationNumber } = body;

    const query = `SELECT * FROM taxidb.orders
      INNER JOIN taxidb.addresses ON taxidb.orders.fk_address=taxidb.addresses.id
      INNER JOIN taxidb.drivers ON taxidb.orders.fk_driver=taxidb.drivers.id
      INNER JOIN taxidb.cars ON taxidb.orders.fk_car=taxidb.cars.id
      WHERE startTime>"${date}" AND registration_number="${registrationNumber}"`;
    this.database.query(query)
      .then(orders => {
        return res.status(200).json(orders);
      })
      .catch(err => res.status(500).json({ "Error": err }))
  }

  getMostExperiencedDriverForCity(req, res) {
    const city = req.body.city;
    const query = `SELECT * FROM taxidb.drivers 
      INNER JOIN taxidb.addresses ON taxidb.drivers.fk_address=taxidb.addresses.id
      WHERE city="${city}"
      ORDER BY CAST(experience_in_days as unsigned) DESC
      LIMIT 1;`;
    this.database.query(query)
      .then(driver => {
        return res.status(200).json(driver);
      })
      .catch(err => res.status(500).json({ "Error": err }))
  }

  getTotalDriverDistanceForEveryCar(req, res) {
    const query = `SELECT taxidb.orders.id, brand, model, registration_number, SUM(distance) total
      FROM taxidb.orders
      INNER JOIN taxidb.cars ON taxidb.orders.fk_car=taxidb.cars.id
      GROUP BY registration_number;`
    this.database.query(query)
      .then(result => {
        return res.status(200).json(result);
      })
      .catch(err => res.status(500).json({ "Error": err }))
  }

  getAllOrdersMadeWithInvalidLicense(req, res) {
    const query = `SELECT * FROM taxidb.orders
      INNER JOIN taxidb.drivers ON taxidb.orders.fk_driver=taxidb.drivers.id
      WHERE (taxidb.orders.startTime > taxidb.drivers.license_valid);`
    this.database.query(query)
      .then(result => {
        return res.status(200).json(result);
      })
      .catch(err => res.status(500).json({ "Error": err }))
  }

  getTotalBillForDriverByEgn(req, res) {
    const egn = req.body.egn;
    const query = `SELECT taxidb.drivers.id AS 'driverId', first_name, last_name, egn, SUM(bill) tatalBill FROM taxidb.orders
      INNER JOIN taxidb.drivers ON taxidb.orders.fk_driver=taxidb.drivers.id
      WHERE egn='${egn}';`
    this.database.query(query)
      .then(result => {
        return res.status(200).json(result);
      })
      .catch(err => res.status(500).json({ "Error": err }))
  }

}

module.exports = CompositeController;
