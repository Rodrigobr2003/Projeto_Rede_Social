const Cadastro = require("../models/CadastroModel");
const Mensagem = require("../models/MensagensModel");

exports.paginaPerfilPesquisado = async (req, res) => {
  const idProfile = req.params.id;
  const idUser = req.session.user._id;

  if (idProfile === idUser) {
    await res.render(`perfil`, {
      pagina: "Perfil",
      css: "perfil",
      script: "perfilPesquisado",
    });
    return;
  }

  let sessionData = req.session.pesquisa.user;
  let objetoDesejado = sessionData.find((objeto) => objeto._id === idProfile);
  const searchedProfile = objetoDesejado;

  res.render("searchedProfile", {
    pagina: `Perfil - ${searchedProfile.nome} ${searchedProfile.sobrenome}`,
    css: "perfil",
    script: "perfilPesquisado",
    searchedProfile,
  });
};

exports.adicionarAmigo = async (req, res) => {
  try {
    const idProfile = req.session.pesquisa.user[0]._id;
    let sessionData = req.session.pesquisa.user;
    let objetoDesejado = sessionData.find((objeto) => objeto._id === idProfile);

    const searchedProfile = {
      nome: objetoDesejado.nome,
      sobrenome: objetoDesejado.sobrenome,
      amigos: objetoDesejado.amigos,
    };

    const user = {
      _id: req.session.user._id,
      nome: req.session.user.nome,
      sobrenome: req.session.user.sobrenome,
      amigos: req.session.user.amigos,
      notificacoes: req.session.user.notificacoes,
    };

    const notificacaoAmizade = {
      idSolicitante: user._id,
      nomeSolicitante: user.nome,
      sobrenomeSolicitante: user.sobrenome,
    };

    let idSearchedProfile = req.session.pesquisa.user[0]._id;

    let novoPerfil = new Cadastro(notificacaoAmizade);
    novoPerfil = await novoPerfil.adicionarNotificacao(idSearchedProfile);

    res.render("searchedProfile", {
      pagina: `Perfil - ${sessionData[0].nome} ${sessionData[0].sobrenome}`,
      css: "perfil",
      script: "perfilPesquisado",
      searchedProfile,
    });
  } catch (error) {
    console.log(`Erro ao adicionar amigo ${error}`);
  }
};

exports.removerAmigo = async (req, res) => {
  try {
    if (req.session.user.amigos == "") return;

    const idProfile = req.session.pesquisa.user[0]._id;
    const userId = req.session.user._id;
    let sessionData = req.session.pesquisa.user;
    let objetoDesejado = sessionData.find((objeto) => objeto._id === idProfile);

    const searchedProfile = objetoDesejado;

    let listaAmigosProfile = objetoDesejado.amigos;
    let excluirIndexProfile = undefined;

    for (amigo in listaAmigosProfile) {
      if (listaAmigosProfile[amigo].idSolicitante === userId) {
        excluirIndexProfile = amigo;
      }
    }

    let listaAmigosUser = req.session.user.amigos;
    let excluirIndex = undefined;

    for (amigo in listaAmigosUser) {
      if (listaAmigosUser[amigo].idSolicitante === idProfile) {
        excluirIndex = amigo;
      }
    }

    let novoPerfil = new Cadastro(listaAmigosUser[excluirIndex]);
    novoPerfil = await novoPerfil.removerAmigo(
      userId,
      excluirIndex,
      idProfile,
      excluirIndexProfile
    );

    req.session.user = novoPerfil;

    res.render("searchedProfile", {
      pagina: `Perfil - ${sessionData[0].nome} ${sessionData[0].sobrenome}`,
      css: "perfil",
      script: "perfilPesquisado",
      searchedProfile,
    });
  } catch (error) {
    console.log("Erro ao excluir amigo", error);
  }
};

exports.amigosSearchedProfile = async (req, res) => {
  const nomeProfile = req.session.pesquisa.user[0].nome;

  let pesquisaUserBd = new Cadastro();
  pesquisaUserBd = await pesquisaUserBd.recuperaDados(nomeProfile);

  res.json(pesquisaUserBd);
};

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
  const idUser = req.session.user._id;
  const idProfile = req.session.pesquisa.user[0]._id;

  const ordenarIds = [idUser, idProfile].sort();
  const room = `${ordenarIds[0]}${ordenarIds[1]}`;

  const data = new Mensagem();
  const modelMensagem = await data.carregaMensagens(room);
  const mensagens = modelMensagem.mensagem;

  if (mensagens == "") {
    return res.json(mensagens);
  }

  res.json(mensagens.mensagem);
};
