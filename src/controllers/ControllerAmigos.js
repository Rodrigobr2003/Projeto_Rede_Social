exports.paginaAmigos = (req, res) => {
  res.render("amigos", {
    pagina: "Amigos",
    css: "amigos",
    script: "amigos",
  });
};

exports.amigos = (req, res) => {
  const listaAmigos = req.session.user.amigos;

  res.json(listaAmigos);
};

exports.removerAmigo = (req, res) => {
  if (req.session.user.amigos.length == 0) return;
};
