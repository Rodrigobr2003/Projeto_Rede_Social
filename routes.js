const express = require("express");
const routes = express.Router();

//Requires
const ControllerIndex = require("./src/controllers/ControllerIndex");
const ControllerHome = require("./src/controllers/ControllerHome");
const ControllerAmigos = require("./src/controllers/ControllerAmigos");
const ControllerNotificacoes = require("./src/controllers/ControllerNotificacoes");
const ControllerPerfil = require("./src/controllers/ControllerPerfil");

routes.get("/", ControllerIndex.paginaIndex);

routes.get("/home", ControllerHome.paginaHome);

routes.get("/amigos", ControllerAmigos.paginaAmigos);

routes.get("/notificacoes", ControllerNotificacoes.paginaNotificacoes);

routes.get("/perfil", ControllerPerfil.paginaPerfil);

module.exports = routes;
