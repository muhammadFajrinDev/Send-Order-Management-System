
const db = require("../models");

const OrderDetails = db.order_details;
const Cencel = db.cencel_delivery;
const Delivery = db.delivery;
const Orders = db.orders;
const Cars = db.cars;

let getDeliveryItem = []
let poid,number_plate;


const Op = db.Sequelize.Op;

exports.sent = async  (req, res) => {

  const doid = req.params.doid;

    // Validate request
    if (!req.params.doid) {
        res.status(401).send({
        message: "DO ID not be empty!"
        });
        return;
    }

    await Delivery.findByPk(doid,{include: ["delivery_details"]})
    .then(data => {
        
      //get IDPO for update STATUS po   
      poid = data.poid
      number_plate = data.number_plate

      if(data.status == 'Canceled'){
        return res.status(401).send({
            message: "Status already Canceled."
            });
      }

      for(let a = 0;  a < data.delivery_details.length; a++){
            getDeliveryItem.push(data.delivery_details[a]) 
      }
    })
    .catch(err => {
        res.status(500).send({
        message: "Error retrieving DO with id=" + doid
        });
    });

    // Close DO if Delivered
    await Delivery.update({status:"Close",delivered_time : new Date().toISOString()},{
            where : {doid : doid}
        }).then(data=>{
            Cars.update({payload_use:0, status:"Open"},{
                where : {number_plate : number_plate}  
        })
    })

    // Close Order Status if not yet pending item
    await Orders.findByPk(poid,{include: ["order_details","delivery"]}).then(data=>{
        
        let pending_item = 0;
        let statusDo = 0

        data.order_details.forEach(m=>{ 
            pending_item += m.qty 
        })
        
        data.delivery.forEach(m=>{
            if(m.status == 'Sending'){
                statusDo += 1
            }
        })

        if(pending_item == 0 && statusDo == 0 ){
            Orders.update({status:"Close"},{
                where : {poid : poid}  
            })
        }else{            
            Orders.update({status:"Pending"},{
                where : {poid : poid}  
            })
        }
        
    })

    res.status(201).send({
        message: "Sent Delivery Success"
    });

};

exports.cancel = async  (req, res) => {

    // Validate request
    if (!req.body.id) {
     return res.status(401).send({
        message: "DO ID not be empty!"
      });
    }

    let doid = req.body.doid;
    
    let cencelStore = {}
    cencelStore['id'] = req.body.id;
    cencelStore['doid'] = req.body.doid;
    cencelStore['reason'] = req.body.reason;
    cencelStore['cencel_time'] = req.body.cencel_time;

    await Delivery.findByPk(doid,{include: ["delivery_details"]})
    .then(data => {
         
    //get IDPO for update STATUS po   
    cencelStore['poid'] = data.poid
    cencelStore['number_plate'] = data.number_plate  

    if(data.status != 'Sending'){
        return res.status(500).send({
            message: "doid is "+data.status+" your are not cancel " + doid
       });
    }
      
    // Plus Stock
    data.delivery_details.forEach((m,i) => {

    OrderDetails.findByPk(m.id_item)
        .then(data => {
            let getDetail = {}
            getDetail['qty'] = (parseInt(data.qty) + parseInt(m.qty))
            getDetail['id'] = m.id_item

            OrderDetails.update({qty:getDetail.qty},{
                where : {id : getDetail.id}
            })
        })
    // end loop  
    })

    Delivery.update({status:"Canceled"},{
        where : {doid : doid}
    }).then(data=>{
        Cars.update({payload_use:0, status:"Open"},{
            where : {number_plate : cencelStore.number_plate}  
        })
    }).catch(err => {
        return res.status(500).send({
             message: "Error Update Cancel DO with id=" + doid
        });
    });

    Cencel.create(cencelStore)
    .then(function(data){
        res.send(data);
    }).catch(err => {
        return res.status(500).send({
             message: "Error Cencel Create DO with id=" + doid
        });
    });

    // Update Status Order Open
    Orders.update({status:"Open"},{
        where : {poid : cencelStore.poid}
    }).catch(err => {
        return res.status(500).send({
             message: "Error Update Status RO with id=" + doid
        });
    });
    

    })
    .catch(err => {
        return res.status(500).send({
             message: "Error retrieving DO with id=" + doid
        });
    });
    
};
  



