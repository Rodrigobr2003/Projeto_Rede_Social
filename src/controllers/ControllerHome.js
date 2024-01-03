exports.paginaHome = (req, res) => {
  res.render("home", {
    pagina: "Home",
    css: "home",
  });
};
