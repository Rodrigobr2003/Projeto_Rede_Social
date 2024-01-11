const CadastroModel = require("../models//CadastroModel"); //

exports.register = async function (req, res) {
  try {
    const cadastro = new CadastroModel(req.body);
    await cadastro.register();

    if (cadastro.errors.length > 0) {
      req.flash("errors", cadastro.errors);
      req.session.save(function () {
        return res.redirect("/");
      });
      return;
    }

    req.flash("success", "Usuário cadastrado com sucesso!");
    req.session.save(function () {
      req.session.id = cadastro._id;
      return res.redirect("/");
    });
    return;
  } catch (e) {
    console.log(e);
    return res.send("ERRO");
  }
};
