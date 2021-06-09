module.exports = (sequelize, Sequelize) => {
    const Cencel = sequelize.define("canceled_delivery", {
      id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      poid: {
        type: Sequelize.STRING,
      },
      doid: {
        type: Sequelize.STRING,
      },
      number_plate: {
        type: Sequelize.STRING
      },
      reason: {
        type: Sequelize.STRING
      },
      cencel_time: {
        type: Sequelize.STRING
      },
    });
  
    return Cencel;
  };