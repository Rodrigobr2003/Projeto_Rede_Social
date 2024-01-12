document.getElementById("btn-fecha-cadastro").addEventListener("click", () => {
  let divCadastro = document.getElementById("cadastro-div");
  let btnCadastro = document.getElementById("btn-cadastro");
  let btnLogin = document.getElementById("btn-login");

  btnCadastro.disabled = false;
  btnLogin.disabled = false;

  divCadastro.style.display = "none";

  const cssTag = document.getElementById("css-cadastro");
  cssTag.remove();

  const jsTag = document.getElementById("js-cadastro");
  jsTag.remove();

  document.body.style.overflow = "auto";
});
