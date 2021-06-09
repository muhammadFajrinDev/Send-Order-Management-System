module.exports = app => {
    const transaction = require("../controllers/transaction_controller");
  
    var router = require("express").Router();
  
    router.post("/cancel", transaction.cancel);
    router.post("/:doid/sent", transaction.sent);
  
    app.use('/api/transaction-delivery', router);
  };