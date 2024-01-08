exports.paginaPerfil = (req, res) => {
  res.render("perfil", {
    pagina: "Perfil",
    css: "perfil",
    script: "",
  });
};
