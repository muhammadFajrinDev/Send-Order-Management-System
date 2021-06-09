module.exports = (sequelize, Sequelize) => {
    const Cars = sequelize.define("cars", {
      number_plate: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      name_car: {
        type: Sequelize.STRING
      },
      payload: {
        type: Sequelize.STRING
      },
      payload_use: {
        type: Sequelize.STRING
      },
      status:{
        type: Sequelize.STRING,
        defaultValue: "Open"
      }
    });
  
    return Cars;
  };

   