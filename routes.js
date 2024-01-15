const express = require("express");
const routes = express.Router();

//Requires
const ControllerIndex = require("./src/controllers/ControllerIndex");
const ControllerHome = require("./src/controllers/ControllerHome");
const ControllerAmigos = require("./src/controllers/ControllerAmigos");
const ControllerNotificacoes = require("./src/controllers/ControllerNotificacoes");
const ControllerPerfil = require("./src/controllers/ControllerPerfil");
const ControllerModalCadastro = require("./src/controllers/ControllerModalCadastro");
const ControllerCadastro = require("./src/controllers/ControllerCadastro");
const ControllerModalLogin = require("./src/controllers/ControllerModalLogin");
const ControllerLogin = require("./src/controllers/ControllerLogin");

//Routes index
routes.get("/", ControllerIndex.paginaIndex);
routes.get("/modal-cadastro", ControllerModalCadastro.modalCadastro);
routes.get("/modal-login", ControllerModalLogin.modalLogin);
routes.post("/login", ControllerLogin.login);
routes.post("/register", ControllerCadastro.register);

//Routes home
routes.get("/home", ControllerHome.paginaHome);

//Routes amigos
routes.get("/amigos", ControllerAmigos.paginaAmigos);

//Routes notificações
routes.get("/notificacoes", ControllerNotificacoes.paginaNotificacoes);

//Routes perfil
routes.get("/perfil/:id", ControllerPerfil.paginaPerfil);

module.exports = routes;
