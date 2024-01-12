const CadastroModel = require("../models/CadastroModel");

exports.login = async (req, res) => {
  try {
    const login = new CadastroModel(req.body);
    await login.login();

    if (login.errors.length > 0) {
      req.flash("errors", login.errors);
      req.session.save(function () {
        return res.redirect("/");
      });
      return;
    }

    req.session.user = login.user;
    req.session.save(() => {
      return res.render("home", {
        pagina: "Home",
        css: "home",
        script: "",
        user: login.user,
      });
    });
  } catch (err) {
    console.log(err);
  }
};
