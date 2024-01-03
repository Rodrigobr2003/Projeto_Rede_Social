const express = require("express");
const routes = express.Router();

//Requires
const ControllerIndex = require("./src/controllers/ControllerIndex");
const ControllerHome = require("./src/controllers/ControllerHome");

routes.get("/", ControllerIndex.paginaIndex);

routes.get("/home", ControllerHome.paginaHome);

module.exports = routes;
