document.addEventListener("DOMContentLoaded", () => {
  let divNotificacoes = document.querySelector(".perfil-amigo");

  fetch("/mostrar-notificacoes", { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      const notificacoes = data;

      if (notificacoes.length == 0) {
        document.querySelector(".perfil-feed").style.display = "none";

        document.querySelector(".aviso-notif").style.display = "flex";

        return;
      }

      for (n in notificacoes) {
        let nomeSol = notificacoes[n].nomeSolicitante;
        let sobrenomSol = notificacoes[n].sobrenomeSolicitante;

        let cloneDiv = document.querySelector(".perfil-feed").cloneNode(true);
        cloneDiv.style.display = "flex";
        let notificacaoAmizade = cloneDiv.querySelector(".userName");

        cloneDiv.querySelector(".value").value = n;

        if (notificacoes[n].tipo === 1) {
          notificacaoAmizade.innerHTML = `${nomeSol} ${sobrenomSol} fez um pedido de amizade`;

          let btnNegar = cloneDiv.querySelector(".negar");
          btnNegar.name = "notificacaoId";
          btnNegar.value = n;
          btnNegar.style.display = "block";

          let btnAceitar = cloneDiv.querySelector(".aceitar");
          btnAceitar.name = "notificacaoId";
          btnAceitar.value = n;
          btnAceitar.style.display = "block";
        }

        if (notificacoes[n].tipo === 2) {
          notificacaoAmizade.innerHTML = `${nomeSol} ${sobrenomSol} enviou uma mensagem`;
        }

        if (notificacoes[n].tipo === 3) {
          notificacaoAmizade.innerHTML = `${nomeSol} ${sobrenomSol} curtiu sua publicação`;
        }

        if (notificacoes[n].tipo === 4) {
          notificacaoAmizade.innerHTML = `${nomeSol} ${sobrenomSol} comentou em sua publicação`;
        }

        divNotificacoes.appendChild(cloneDiv);
      }
    })
    .catch((err) => console.log(err));
});
