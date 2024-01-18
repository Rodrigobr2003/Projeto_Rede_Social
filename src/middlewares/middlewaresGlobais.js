exports.flashMessagesMiddleware = (req, res, next) => {
  res.locals.errors = req.flash("errors");
  res.locals.success = req.flash("success");
  res.locals.user = req.session.user;
  res.locals.pesquisa = req.session.pesquisa;
  next();
};

exports.loginRequired = (req, res, next) => {
  if (!req.session.user) {
    req.flash("errors", "Você precisa estar logado para acessar esta página");
    req.session.save(() => {
      res.redirect("/");
    });
    return;
  }
  next();
};
