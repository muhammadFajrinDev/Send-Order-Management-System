module.exports = (sequelize, Sequelize) => {
    const Orders = sequelize.define("orders", {
      poid: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      total_weight: {
        type: Sequelize.STRING
      },
      qty: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      date_purchase:{
        type: Sequelize.STRING
      }
    });
  
    return Orders;
  };