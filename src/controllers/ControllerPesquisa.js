const CadastroModel = require("../models/CadastroModel");

exports.pesquisaUser = async (req, res) => {
  try {
    const users = new CadastroModel();

    await users.recuperaDados(req.query.pesquisa);

    res.json(users);
  } catch (err) {
    console.log("Erro ao pesquisar por usuários", err);
  }
};
