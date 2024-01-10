document.addEventListener("DOMContentLoaded", function () {
  const btnCadastro = document.getElementById("btn-cadastro");
  const content = document.getElementById("content");
  const div = document.createElement("div");
  let dataArquivo = false;

  btnCadastro.addEventListener("click", () => {
    if (!dataArquivo) {
      fetch("/modal-cadastro")
        .then((response) => response.text())
        .then((data) => {
          dataArquivo = data;
          criaModal();

          criaCssTag();
          criaJsTag();
          btnCadastro.disabled = true;
          document.body.style.overflow = "hidden";
        })
        .catch((err) => {
          console.log(`Erro ao carregar o arquivo de cadastro: ${err}`);
        });
    }

    if (dataArquivo) {
      criaModal();

      criaCssTag();
      criaJsTag();
    }
  });

  function criaModal() {
    div.innerHTML = dataArquivo;
    content.appendChild(div);
  }

  function criaCssTag() {
    cssTag = document.createElement("link");
    cssTag.rel = "stylesheet";
    cssTag.type = "text/css";
    cssTag.href = "/cadastro.css";
    cssTag.id = "css-cadastro";
    document.head.appendChild(cssTag);
  }

  function criaJsTag() {
    if (!document.getElementById("js-cadastro")) {
      jsTag = document.createElement("script");
      jsTag.id = "js-cadastro";
      jsTag.src = "/cadastro.js";
      document.head.appendChild(jsTag);
    }
  }
});
