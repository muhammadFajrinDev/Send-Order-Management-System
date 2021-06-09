
const db = require("../models");

const OrderDetails = db.order_details;
const Delivery = db.delivery;
const Orders = db.orders;
const Cars = db.cars;

exports.cars_activity = async  (req, res) => {

    const number_plate = req.query.number_plate;
    console.log(number_plate)
    var condition = number_plate ? { number_plate: { [Op.like]: `%${number_plate}%` } } : null;
    
    let head = []

    Cars.findAll({include: ["delivery"]},{ where: condition },)
      .then(data => {
        if(!data){
          res.status(500).send({status:-1, data});
        }else{
          res.status(200).send({status:1, data}); 
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving Order."
        });
      });

      

};

exports.findOne = (req, res) => {
  const number_plate = req.params.number_plate;

  Cars.findByPk(number_plate,{include: ["delivery"]})
    .then(data => {
      if(!data){
        res.status(500).send({status:-1, data});
      }else{
        res.status(200).send({status:1, data}); 
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving number_plate with id=" + number_plate
      });
    });
};
  



