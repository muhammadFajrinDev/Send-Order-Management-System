  module.exports = (sequelize, Sequelize) => {
    const DeliveryDetails = sequelize.define("delivery_details", {
      doid: {
        type: Sequelize.STRING
      },
      number_plate: {
        type: Sequelize.STRING
      },
      item_name: {
        type: Sequelize.STRING
      },id_item :{
        type: Sequelize.STRING 
      },
      weight_peritem: {
        type: Sequelize.STRING
      },
      weight: {
        type: Sequelize.STRING
      },
      qty: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
    });
  
    return DeliveryDetails;
  };