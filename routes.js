const express = require("express");
const routes = express.Router();
const upload = require("./src/config/multer");

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
const ControllerPesquisa = require("./src/controllers/ControllerPesquisa");
const ControllerSearchedProfile = require("./src/controllers/ControllerSearchedProfile");
const ControllerEditUser = require("./src/controllers/ControllerEditarPerfil");
const ControllerMensagens = require("./src/controllers/ControllerMensagens");
const ControllerImagens = require("./src/controllers/ControllerImagens");

//Middlewares
const { loginRequired } = require("./src/middlewares/middlewaresGlobais");

//Routes index
routes.get("/", ControllerIndex.paginaIndex);
routes.get("/modal-cadastro", ControllerModalCadastro.modalCadastro);
routes.get("/modal-login", ControllerModalLogin.modalLogin);
routes.post("/login", ControllerLogin.login);
routes.post("/register", ControllerCadastro.register);

//Routes home
routes.get("/home", loginRequired, ControllerHome.paginaHome);

//Routes pesquisa
routes.get("/pesquisa-user", ControllerPesquisa.pesquisaUser);
routes.get(
  "/searched-user/:id",
  ControllerSearchedProfile.paginaPerfilPesquisado
);
routes.post("/adicionar-amigo", ControllerSearchedProfile.adicionarAmigo);
routes.post("/remover-amigo", ControllerSearchedProfile.removerAmigo);
routes.get("/mostra-amigos", ControllerSearchedProfile.amigosSearchedProfile);
routes.post("/procura-perfil", ControllerSearchedProfile.procurarPerfilId);

//Routes mensagens
routes.get(
  "/searched-user/:id/chat-profile",
  loginRequired,
  ControllerMensagens.chatProfile //
);
routes.post("/salva-mensagens", ControllerMensagens.salvaMensagens);
routes.post("/carrega-mensagens", ControllerMensagens.carregaMensagens);
routes.post("/curtir-mensagem", ControllerMensagens.curtirMsg);
routes.post("/remover-curtida", ControllerMensagens.removerCurtida);
routes.post("/salva-comentario", ControllerMensagens.salvaComentario);
routes.post("/carrega-comentarios", ControllerMensagens.carregaComentario);
routes.post("/apagar-mensagem", ControllerMensagens.apagarMsg);

//Routes amigos
routes.get("/amigos", loginRequired, ControllerAmigos.paginaAmigos);
routes.get("/carrega-amigos", ControllerAmigos.amigos);

//Routes notificações
routes.get(
  "/notificacoes",
  loginRequired,
  ControllerNotificacoes.paginaNotificacoes
);
routes.get("/mostrar-notificacoes", ControllerNotificacoes.notficacoes);
routes.post("/negar-amigo", ControllerNotificacoes.negar);
routes.post("/aceitar-amigo", ControllerNotificacoes.aceitar);
routes.post("/exluir-notficacao", ControllerNotificacoes.excluirNotf);

//Routes perfil
routes.get("/perfil/:id", loginRequired, ControllerPerfil.paginaPerfil);
routes.post("/edit-user", ControllerEditUser.editUser);
routes.get("/dados-user", ControllerPerfil.dadosUser);

//Routes Imagens
routes.post("/criar-imagem", upload.single("file"), ControllerImagens.create);

module.exports = routes;
