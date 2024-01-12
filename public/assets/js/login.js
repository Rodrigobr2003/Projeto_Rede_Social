document.getElementById("btn-fecha-login").addEventListener("click", () => {
  let divLogin = document.getElementById("login-div");
  let btnCadastro = document.getElementById("btn-cadastro");
  let btnLogin = document.getElementById("btn-login");

  btnCadastro.disabled = false;
  btnLogin.disabled = false;

  divLogin.style.display = "none";

  const cssTag = document.getElementById("css-login");
  cssTag.remove();

  const jsTag = document.getElementById("js-login");
  jsTag.remove();

  document.body.style.overflow = "auto";
});
