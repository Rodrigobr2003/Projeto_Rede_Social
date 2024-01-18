const Cadastro = require("../models/CadastroModel");

exports.paginaPerfilPesquisado = async (req, res) => {
  const idProfile = req.params.id;
  let sessionData = req.session.pesquisa.user;
  let objetoDesejado = sessionData.find((objeto) => objeto._id === idProfile);

  const searchedProfile = objetoDesejado;

  res.render("searchedProfile", {
    pagina: `Perfil - `,
    css: "perfil",
    script: "",
    searchedProfile,
  });
};
