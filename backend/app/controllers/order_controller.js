const { get } = require("dottie");
const db = require("../models");
const Order = db.orders;
const Op = db.Sequelize.Op;


exports.create = (req, res) => {
  // Validate request
  if (!req.body.poid) {
    res.status(401).send({
      message: "PO ID not be empty!"
    });
    return;
  }

  let getDetail = req.body.order_detail
  let totalQty=0, totalWeight=0;

  for(let a = 0; a < getDetail.length; a++){
      totalQty += parseInt(getDetail[a].qty)
      totalWeight += parseInt(getDetail[a].weight)
  }
  
  const order = {
    poid: req.body.poid,
    total_weight: totalWeight,
    qty: totalQty,
    qty_res: totalQty,
    status: req.body.status,
    date_purchase: req.body.date_purchase,
    order_details: getDetail
  };

  Order.create(order,{
      include : 'order_details',
  })
    .then(function(data){
        res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Order."
      });
    });
};

exports.findAll = (req, res) => {
    const poid = req.query.poid;
    var condition = poid ? { poid: { [Op.like]: `%${poid}%` } } : null;
  
    Order.findAll({ where: condition,order : [
      ['createdAt','DESC']
    ]},)
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
    const poid = req.params.poid;

    Order.findByPk(poid,{include: ["order_details","delivery"]})
      .then(data => {
        if(!data){
          res.status(500).send({status:-1, data});
        }else{
          res.status(200).send({status:1, data}); 
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving PO with id=" + poid
        });
      });
};

exports.update = (req, res) => {
  
};

exports.delete = (req, res) => {
  
};

exports.deleteAll = (req, res) => {
  
};

exports.findAllPublished = (req, res) => {
  
};