const Mensagem = require("../models/MensagensModel");

exports.chatProfile = (req, res) => {
  res.render("chatProfile", {
    pagina: "Chat",
    css: "chat",
    script: "chat",
  });
};

exports.salvaMensagens = async (req, res) => {
  const idUser = req.session.user._id;

  const mensagem = new Mensagem(req.body.message.texto);
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
