module.exports = app => {
    const delivery = require("../controllers/delivery_controller");
  
    var router = require("express").Router();
  
    router.post("/", delivery.create);
  
    router.get("/", delivery.findAll);
  
    router.get("/:doid", delivery.findOne);

    router.put("/:doid", delivery.update);
  
    router.delete("/:doid", delivery.delete);
 
    router.delete("/", delivery.deleteAll);
  
    app.use('/api/delivery', router);
  };