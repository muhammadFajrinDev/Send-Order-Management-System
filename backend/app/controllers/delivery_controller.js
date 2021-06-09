
const db = require("../models");
const orderDetails = db.order_details
const Delivery = db.delivery;
const Orders = db.orders;
const Cars = db.cars;

const Op = db.Sequelize.Op;

exports.create = async  (req, res) => {
  // Validate request
  if (!req.body.doid) {
    res.status(401).send({
      message: "DO ID not be empty!"
    });
    return;
  }

  let number_plate = req.body.number_plate;
  let totalPayloadDelivery = 0
  let poid = req.body.poid;
  let max_capacity_car = 0;
  
  let pendingItemsData = []
  let filterItems = []
  let totalWeight = 0;

  let delivery = {}
  let getItems = []
  

  // get Detail PO 
  await Orders.findByPk(poid,{include: ["order_details"]})
  .then(data => {

    getPayloadOrder = data.total_weight
    delivery['doid'] = req.body.doid;
    delivery['poid'] = data.poid;
    delivery['target_time'] = req.body.target_time

    // declare object first
    delivery['car_name']

    // Get Order Detail From PO
    for(j=0; j < data.order_details.length; j++){
      if(data.order_details[j].qty != 0){
        getItems.push(data.order_details[j])
      }
    }

  })
  .catch(err => {
    return res.status(500).send({
      message: "Error retrieving PO with id=" + poid
    });
  });
   
  // Get Data Cars
  await Cars.findByPk(number_plate)
  .then(data => {
    
    if(data.status != 'Open'){
        return res.send({
        message: "Car on Delivery please Change the car other"
      });
      
    }else{
     
      delivery['car_name'] = data.name_car
      delivery['number_plate'] = number_plate
      
      max_capacity_car = data.payload

       
      // check payload with order height
      for(let a = 0; a < getItems.length; a++){
        
        totalWeight += parseInt(getItems[a].weight);
        
        if(totalWeight > max_capacity_car){
          
          let adjustCapacity = {}
          
          if(getItems[a].weight > (totalWeight - max_capacity_car)){
            
            let FORMULA_QTY = (((totalWeight - max_capacity_car) / getItems[a].weight * 100) * getItems[a].qty / 100)

            adjustCapacity['id_item'] = getItems[a].id
            adjustCapacity['qty'] = Math.round(getItems[a].qty - FORMULA_QTY)
            adjustCapacity['type'] = getItems[a].type
            adjustCapacity['weight'] = (getItems[a].weight - (totalWeight - max_capacity_car))
            adjustCapacity['weight_peritem'] =  getItems[a].weight_peritem
            adjustCapacity['item_name'] = getItems[a].item_name
            adjustCapacity['number_plate'] = number_plate
            adjustCapacity['doid'] = req.body.doid

            filterItems.push(adjustCapacity)

          }
            //Show Pending Items
            let pendingItems = {}
            pendingItems['id_item'] = getItems[a].id
            pendingItems['qty'] = Math.floor(getItems[a].qty - adjustCapacity.qty) || getItems[a].qty
            pendingItems['type'] = getItems[a].type
            pendingItems['weight'] = getItems[a].weight_peritem * Math.floor(getItems[a].qty - adjustCapacity.qty) || getItems[a].weight
            pendingItems['weight_peritem'] =  getItems[a].weight_peritem
            pendingItems['item_name'] = getItems[a].item_name
            pendingItems['number_plate'] = number_plate
            pendingItems['doid'] = req.body.doid

            pendingItemsData.push(pendingItems)

        }else{
            let itemOrder = {}
            itemOrder['id_item'] = getItems[a].id
            itemOrder['qty'] = getItems[a].qty
            itemOrder['type'] = getItems[a].type
            itemOrder['weight'] = (getItems[a].weight_peritem * getItems[a].qty)
            itemOrder['weight_peritem'] =  getItems[a].weight_peritem
            itemOrder['item_name'] = getItems[a].item_name
            itemOrder['number_plate'] = number_plate
            itemOrder['doid'] = req.body.doid

            filterItems.push(itemOrder)
        }
      }

      // getPayload Total 
      for(let b = 0; b < filterItems.length; b++){
        totalPayloadDelivery += parseInt(filterItems[b].weight)
      }
      
      delivery['status'] = "Sending"
      delivery['payload'] = totalPayloadDelivery
      delivery['delivery_details'] = filterItems

      //Create Delivery and Close
      Delivery.create(delivery,{
        include : 'delivery_details',
      })
      .then(function(data){
        
          carsUpdate = {}
          carsUpdate['status'] = totalPayloadDelivery < max_capacity_car ? 'Available' : 'Full'
          carsUpdate['payload_use'] = totalPayloadDelivery 

          // Cars Update Status Sending
          Cars.update(carsUpdate,{
            where : {number_plate : number_plate}
          })

          .catch(err =>{
            res.status(500).send({
              status : false,
              message: "Error updating Cars with Plate=" + number_plate
            });
          })

          // Order Update Status Sending
          Orders.update({status:"Sending"},{
            where : {poid : poid}
          })

          .catch(err =>{
            res.status(500).send({
              status : false,
              message: "Error updating Order with PO ID=" + poid
            });
          })

        // Minus Stock
        filterItems.forEach((m,i) => {
        
          orderDetails.findByPk(m.id_item)
          .then(data => {
              let getDetail = {}
              getDetail['qty'] = (data.qty - m.qty)
              getDetail['id'] = m.id_item
      
              orderDetails.update({qty:getDetail.qty},{
                where : {id : getDetail.id}
              })
          })
          .catch(err => {
            res.status(500).send({
              message: "Error retrieving PO with id=" + doid
            });
          });

      })

      res.send({data: data, pendingItems :pendingItemsData});

      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Delivery."
        });
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Car with id=" + poid
    });
  });

};

exports.findAll = (req, res) => {
  const doid = req.query.doid;
  var condition = doid ? { doid: { [Op.like]: `%${doid}%` } } : null;

  Delivery.findAll({ where: condition ,order : [
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
  const doid = req.params.doid;

  Delivery.findByPk(doid,{include: ["delivery_details","cencel_delivery"]})
    .then(data => {
      if(!data){
        res.status(500).send({status:-1, data});
      }else{
        res.status(200).send({status:1, data}); 
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving DO with id=" + doid
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