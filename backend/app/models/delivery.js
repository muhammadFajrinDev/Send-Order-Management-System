module.exports = (sequelize, Sequelize) => {
    const Delivery = sequelize.define("delivery", {
      doid: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      poid: {
        type: Sequelize.STRING,
      },
      number_plate: {
        type: Sequelize.STRING
      },
      car_name: {
        type: Sequelize.STRING
      },
      payload: {
        type: Sequelize.STRING
      },
      delivered_time: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      target_time: {
        type: Sequelize.STRING
      },
      
    });
  
    return Delivery;
  };