
const readXlsxFile = require("read-excel-file/node");

const upload = async (req, res) => {
    try {
      if (req.file == undefined) {
        return res.status(400).send("Please upload an excel file!");
      }
     
      let path = __basedir + "/app/assets/uploads/" + req.file.filename;
  
      readXlsxFile(path).then((rows) => {
        // skip header
        rows.shift();
  
        let items = [];
  
        rows.forEach((row) => {
          let item = {
            item_name: row[0],
            weight_peritem: row[1],
            weight: row[2],
            type: row[3],
            qty: row[4],
          };
  
          items.push(item);
        });
        
        res.status(200).send(items);
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Could not upload the file: " + req.file.originalname,
      });
    }

  };

  module.exports = {
    upload
  };