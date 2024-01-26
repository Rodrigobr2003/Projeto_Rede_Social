document.addEventListener("DOMContentLoaded", function () {
  const btnCadastro = document.getElementById("btn-cadastro");
  const btnLogin = document.getElementById("btn-login");
  const content = document.getElementById("content");
  const div = document.createElement("div");
  let dataArquivoCadastro = false;
  let dataArquivoLogin = false;

  btnCadastro.addEventListener("click", () => {
    let arquivo = "cadastro";
    if (!dataArquivoCadastro) {
      fetch("/modal-cadastro")
        .then((response) => response.text())
        .then((data) => {
          dataArquivoCadastro = data;
          criaModal(dataArquivoCadastro);

          criaCssTag(arquivo);
          criaJsTag(arquivo);

          disable();
        })
        .catch((err) => {
          console.log(`Erro ao carregar o arquivo de cadastro: ${err}`);
        });
    }

    if (dataArquivoCadastro) {
      criaModal(dataArquivoCadastro);

      criaCssTag(arquivo);
      criaJsTag(arquivo);
    }
  });

  btnLogin.addEventListener("click", () => {
    let arquivo = "login";
    fetch("modal-login")
      .then((response) => response.text())
      .then((data) => {
        dataArquivoLogin = data;
        criaModal(dataArquivoLogin);

        criaCssTag(arquivo);
        criaJsTag(arquivo);

        disable();
      })
      .catch((err) =>
        console.log(`Erro ao carregar o arquivo de login: ${err}`)
      );
  });

  function criaModal(arquivo) {
    div.innerHTML = arquivo;
    content.appendChild(div);
  }

  function criaCssTag(arquivo) {
    cssTag = document.createElement("link");
    cssTag.rel = "stylesheet";
    cssTag.type = "text/css";
    cssTag.href = `/${arquivo}.css`;
    cssTag.id = `css-${arquivo}`;
    document.head.appendChild(cssTag);
  }

  function criaJsTag(arquivo) {
    if (!document.getElementById(`js-${arquivo}`)) {
      jsTag = document.createElement("script");
      jsTag.id = `js-${arquivo}`;
      jsTag.src = `/${arquivo}.js`;
      document.head.appendChild(jsTag);
    }
  }

  function disable() {
    btnCadastro.disabled = true;
    btnLogin.disabled = true;
    document.body.style.overflow = "hidden";
  }
});
