const CadastroModel = require("../models/CadastroModel");
exports.editUser = async (req, res) => {
  try {
    const perfilAtualizado = new CadastroModel(req.body);
    await perfilAtualizado.editar(req.session.user._id);

    if (perfilAtualizado.errors.length > 0) {
      req.flash("errors", perfilAtualizado.errors);
      req.session.save(() => {
        res.redirect(`/perfil/${perfilAtualizado.user._id}`);
      });
      return;
    }

    await req.session.save(() =>
      res.redirect(`/perfil/${perfilAtualizado.user._id}`)
    );
    return;
  } catch (err) {
    console.log("Erro ao editar user: ", err);
  }
};
