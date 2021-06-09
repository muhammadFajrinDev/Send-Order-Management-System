const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// refresh model id update
const db = require("./app/models");

global.__basedir = __dirname;

// Initial Cars

function initial() {
    db.cars.create({
        number_plate: "VAY08080",
        name_car: "Suzuki New Carry Pick Up",
        payload : 1000,
        payload_use : 0
    });
    db.cars.create({
        number_plate: "SDSEW24W",
        name_car: "Suzuki New Thunder Pick Up",
        payload : 500,
        payload_use : 0
    });
    db.cars.create({
      number_plate: "DWEFE454",
      name_car: "Colt Diesel Double",
      payload : 750,
      payload_use : 0
    });
    db.cars.create({
      number_plate: "D5T45T54",
      name_car: "Dragline Excavator",
      payload : 1200,
      payload_use : 0
    });
    db.cars.create({
      number_plate: "453FEF343",
      name_car: "Colt Diesel Engkel",
      payload : 900,
      payload_use : 0
    });
    db.cars.create({
      number_plate: "SDASD2WDSASD",
      name_car: "Truck Trinton",
      payload : 900,
      payload_use : 0
    });
    db.cars.create({
      number_plate: "SAD23DW2W",
      name_car: "Mitsubishi L300 ",
      payload : 900,
      payload_use : 0
    });
}

// db.sequelize.sync();
db.sequelize.sync({ force: true }).then(() => {
    console.log("Drop and re-sync db.");
    initial()
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Send Order Management System" });
});

require("./app/routes/transaction_routes")(app);
require("./app/routes/cenceled_delivery")(app);
require("./app/routes/delivery_routes")(app);
require("./app/routes/order_routes")(app);
require("./app/routes/cars_route")(app);
require("./app/routes/import")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});