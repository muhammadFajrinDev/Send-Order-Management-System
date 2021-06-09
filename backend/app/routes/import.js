module.exports = app => {
    const excelController  = require("../controllers/excel.controller");
    const upload = require("../middleware/upload");
    var router = require("express").Router();
    
  
    // router.post("/upload",upload.single("file"),excelController.upload);
    router.post("/upload",upload.single("file"),excelController.upload);
  
    app.use('/api/excel', router);
  };