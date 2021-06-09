module.exports = app => {
    const cars = require("../controllers/cars_controller");
  
    var router = require("express").Router();
  
    router.get("/", cars.cars_activity);
    router.get("/:number_plate", cars.findOne);

    app.use('/api/cars-activity', router);
  };