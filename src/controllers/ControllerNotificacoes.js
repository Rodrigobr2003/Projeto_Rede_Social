exports.paginaNotificacoes = (req, res) => {
  res.render("notificacoes", {
    pagina: "Notificações",
    css: "notificacoes",
  });
};
