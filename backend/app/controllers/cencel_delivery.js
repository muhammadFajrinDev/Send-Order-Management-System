
const db = require("../models");

const CencelDelivery = db.cencel_delivery;


exports.findAll = async  (req, res) => {

    const id = req.query.id;
    var condition = id ? { doid: { [Op.like]: `%${id}%` } } : null;
    
    CencelDelivery.findAll(
        {include: ["delivery"]
    
    },{ where: condition },)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Order."
        });
      });

};


  



