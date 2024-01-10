const Cadastro = require("../models//CadastroModel"); //

exports.register = async function (req, res) {
  try {
    const cadastro = new Cadastro(req.body); //req.body é corpo da requisição POST (sao os dados do form)
    await cadastro.register();

    if (cadastro.errors.length > 0) {
      req.flash("errors", login.errors); //instalar pacot flash
      req.session.save(function () {
        return res.redirect("/");
      });
      return;
    }

    return res.send(req.body);
  } catch (e) {
    return res.send("ERRO");
  }
};
