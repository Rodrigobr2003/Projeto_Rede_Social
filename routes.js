const express = require("express");
const routes = express.Router();

//Requires
const indexController = require("./src/controllers/ControllerIndex");

routes.get("/", indexController.paginaIndex);

module.exports = routes;
