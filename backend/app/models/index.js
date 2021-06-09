const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.delivery_details = require("./delivery_details.js")(sequelize, Sequelize);
db.cencel_delivery = require("./canceled_delivery")(sequelize, Sequelize);
db.order_details = require("./order_details.js")(sequelize, Sequelize);
db.delivery = require("./delivery.js")(sequelize, Sequelize);
db.orders = require("./orders.js")(sequelize, Sequelize);
db.cars = require("./cars.js")(sequelize, Sequelize);

db.orders.hasMany(db.order_details, { as: "order_details",  foreignKey: "poid"});
db.order_details.belongsTo(db.orders, { foreignKey: "poid", });

db.delivery.hasMany(db.delivery_details, { as: "delivery_details",  foreignKey: "doid"});
db.delivery_details.belongsTo(db.delivery, { foreignKey: "doid", });

db.cars.hasMany(db.delivery, { as: "delivery",  foreignKey: "number_plate"});
db.delivery.belongsTo(db.cars, { foreignKey: "number_plate", });

db.delivery.hasOne(db.cencel_delivery, { as: "cencel_delivery",  foreignKey: "doid"});
db.cencel_delivery.belongsTo(db.delivery, { foreignKey: "doid", });

// PO Activity 
db.orders.hasMany(db.delivery, { as: "delivery",  foreignKey: "poid"});


module.exports = db;