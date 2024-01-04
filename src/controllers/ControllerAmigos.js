exports.paginaAmigos = (req, res) => {
  res.render("amigos", {
    pagina: "Amigos",
    css: "amigos",
  });
};
