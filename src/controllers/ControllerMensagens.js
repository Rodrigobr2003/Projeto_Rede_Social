const Mensagem = require("../models/MensagensModel");
const moment = require("moment");

exports.chatProfile = (req, res) => {
  res.render("chatProfile", {
    pagina: "Chat",
    css: "chat",
    script: "chat",
  });
};

exports.salvaMensagens = async (req, res) => {
  const momento = moment().format("DD/MM h:mm");
  req.body.message.tempo = momento;

  if (req.body.message.texto === "") return;

  const idUser = req.session.user._id;

  const mensagem = new Mensagem(req.body.message);
  await mensagem.registrarMensagem(req.body.chatRoom, idUser);

  res.json(mensagem);
};

exports.carregaMensagens = async (req, res) => {
  const room = req.body.chatRoom;

  const data = new Mensagem();
  const modelMensagem = await data.carregaMensagens(room);
  const mensagens = modelMensagem.mensagem;

  if (mensagens == "") {
    return res.json(mensagens);
  }

  res.json(mensagens.mensagem);
};

exports.curtirMsg = async (req, res) => {
  const room = req.body.chatRoom;
  const index = req.body.index;
  const idUser = req.body.idUser;

  let curtida = new Mensagem();
  curtida = await curtida.adicionarCurtida(room, index, idUser);
};

exports.removerCurtida = async (req, res) => {
  const room = req.body.chatRoom;
  const index = req.body.index;
  const idUser = req.body.idUser;

  let curtida = new Mensagem();
  curtida = await curtida.removerCurtida(room, index, idUser);
};

exports.salvaComentario = async (req, res) => {
  const comentario = req.body.comentario;
  const room = req.body.chatRoom;
  const index = req.body.index;
  const idUser = req.body.idUser;

  let comment = new Mensagem();
  comment = await comment.adicionarComentario(room, index, comentario, idUser);
};

exports.carregaComentario = async (req, res) => {
  const room = req.body.chatRoom;

  let loadComments = new Mensagem();
  loadComments = await loadComments.carregarComentarios(room);

  res.json(loadComments);
};
