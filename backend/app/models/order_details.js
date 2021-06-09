module.exports = (sequelize, Sequelize) => {
    const orderDetails = sequelize.define("order_details", {
      poid: {
        type: Sequelize.STRING,
      },
      item_name: {
        type: Sequelize.STRING
      },
      weight_peritem: {
        type: Sequelize.STRING
      },
      weight: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      qty: {
        type: Sequelize.STRING
      },
      qty_res: {
        type: Sequelize.STRING
      }
    });
  
    return orderDetails;
  };