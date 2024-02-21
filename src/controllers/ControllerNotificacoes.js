const Cadastro = require("../models/CadastroModel");

exports.paginaNotificacoes = (req, res) => {
  res.render("notificacoes", {
    pagina: "Notificações",
    css: "notificacoes",
    script: "notificacoes",
    user: res.locals.user,
  });
};

exports.notficacoes = (req, res) => {
  const userNotifications = req.session.user.notificacoes;

  res.json(userNotifications);
};

exports.negar = async (req, res) => {
  try {
    if (req.session.user.notificacoes == "") return;

    const userId = req.session.user._id;

    const notfIndex = req.body.notificacaoId;

    const listaNotificacoes = req.session.user.notificacoes;

    let novoPerfil = new Cadastro(listaNotificacoes[notfIndex]);
    novoPerfil = await novoPerfil.removerPedidoAmigo(userId, notfIndex);

    req.session.user = novoPerfil;

    res.render("notificacoes", {
      pagina: "Notificações",
      css: "notificacoes",
      script: "notificacoes",
      user: res.locals.user,
    });
  } catch (error) {
    console.log("Erro ao negar pedido de amizade", error);
  }
};

exports.aceitar = async (req, res) => {
  try {
    if (req.session.user.notificacoes.length == 0) return;

    const userId = req.session.user._id;

    const notfIndex = req.body.notificacaoId;

    const listaNotificacoes = req.session.user.notificacoes;

    const idAmigo = listaNotificacoes[notfIndex].idSolicitante;

    const dataUser = {
      idSolicitante: userId,
      nomeSolicitante: req.session.user.nome,
      sobrenomeSolicitante: req.session.user.sobrenome,
    };

    let novoPerfil = new Cadastro(listaNotificacoes[notfIndex]);
    novoPerfil = await novoPerfil.aceitarPedidoAmigo(
      userId,
      notfIndex,
      idAmigo,
      dataUser
    );

    req.session.user = novoPerfil;

    res.render("notificacoes", {
      pagina: "Notificações",
      css: "notificacoes",
      script: "notificacoes",
      user: res.locals.user,
    });
  } catch (error) {
    console.log("Erro ao aceitar pedido de amizade", error);
  }
};

exports.excluirNotf = async (req, res) => {
  try {
    if (req.session.user.notificacoes == "") return;

    const userId = req.session.user._id;

    const indexNotf = req.body.id;

    let excluir = new Cadastro();
    excluir = await excluir.excluirNotificacao(userId, indexNotf);

    req.session.user = excluir;

    res.render("notificacoes", {
      pagina: "Notificações",
      css: "notificacoes",
      script: "notificacoes",
      excluir,
    });
  } catch (error) {
    console.log("Erro ao excluir notificação: ", error);
  }
};
