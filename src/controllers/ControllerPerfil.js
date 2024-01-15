const CadastroModel = require("../models/CadastroModel");

exports.paginaPerfil = async (req, res) => {
  try {
    if (!req.session.user._id)
      return res.send("Erro ao carregar pagina perfil");

    const user = await CadastroModel.buscaId(req.session.user._id);

    if (!user) res.render("Erro ao buscar id");

    res.render("perfil", {
      pagina: "Perfil",
      css: "perfil",
      script: "",
      user,
    });
  } catch (error) {
    console.log(error);
    res.send("Erro catch");
  }
};
