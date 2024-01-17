const CadastroModel = require("../models/CadastroModel");

exports.paginaPerfil = async (req, res) => {
  req.params._id = req.params.id.replace(":", "");
  try {
    if (!req.params._id) return res.send("Erro ao carregar pagina perfil");

    const user = await CadastroModel.buscaId(req.params._id);

    if (!user) res.render("Erro ao buscar id");

    res.render("perfil", {
      pagina: `Perfil - ${user.nome} ${user.sobrenome}`,
      css: "perfil",
      script: "",
      user,
    });
  } catch (error) {
    console.log(error);
    res.send("Erro catch");
  }
};
