document.addEventListener("DOMContentLoaded", function () {
  const btnCadastro = document.getElementById("btn-cadastro");
  const content = document.getElementById("content");
  const div = document.createElement("div");

  const cssTag = document.createElement("link");
  cssTag.rel = "stylesheet";
  cssTag.type = "text/css";
  cssTag.href = "/cadastro.css";

  btnCadastro.addEventListener("click", () => {
    fetch("/modal-cadastro")
      .then((response) => response.text())
      .then((data) => {
        div.innerHTML = data;
        content.innerHTML = "";
        content.appendChild(div);

        document.head.appendChild(cssTag);
      })
      .catch((err) => {
        console.log(`Erro ao carregar o arquivo de cadastro: ${err}`);
      });
  });
});
