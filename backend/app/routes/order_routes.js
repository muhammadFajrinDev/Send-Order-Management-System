module.exports = app => {
    const order = require("../controllers/order_controller");
  
    var router = require("express").Router();
  
    router.post("/", order.create);
  
    router.get("/", order.findAll);
      
    router.get("/:poid", order.findOne);

    router.put("/:poid", order.update);
  
    router.delete("/:poid", order.delete);
 
    router.delete("/", order.deleteAll);
  
    app.use('/api/order', router);
  };