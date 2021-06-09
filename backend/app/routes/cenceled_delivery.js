module.exports = app => {
    const cencel_delivery = require("../controllers/cencel_delivery");
  
    var router = require("express").Router();
  
    router.get("/", cencel_delivery.findAll);
  
    app.use('/api/cancel-delivery', router);
  };