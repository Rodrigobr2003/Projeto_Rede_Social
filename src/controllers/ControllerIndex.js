exports.paginaIndex = (req, res) => {
  res.render("index", {
    pagina: "Login & Cadastro",
    css: "index",
    script: "index",
  });
};
