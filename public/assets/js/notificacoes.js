document.addEventListener("DOMContentLoaded", () => {
  let divNotificacoes = document.querySelector(".perfil-amigo");

  fetch("/mostrar-notificacoes", { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      const notificacoes = data;

      if (notificacoes.length == 0) {
        let divPerfilAmigo = document.querySelector(".perfil-feed");
        divPerfilAmigo.style.display = "none";

        let avisoNotif = document.querySelector(".aviso-notif");
        avisoNotif.style.display = "flex";

        return;
      }

      for (n in notificacoes) {
        let nomeSol = notificacoes[n].nomeSolicitante;
        let sobrenomSol = notificacoes[n].sobrenomeSolicitante;

        let cloneDiv = document.querySelector(".perfil-feed").cloneNode(true);
        cloneDiv.style.display = "flex";

        let notificacaoAmizade = cloneDiv.querySelector(".userName");
        notificacaoAmizade.innerHTML = `${nomeSol} ${sobrenomSol} fez um pedido de amizade`;

        let btnNegar = cloneDiv.querySelector(".negar");
        btnNegar.name = "notificacaoId";
        btnNegar.value = n;

        let btnAceitar = cloneDiv.querySelector(".aceitar");
        btnAceitar.name = "notificacaoId";
        btnAceitar.value = n;

        divNotificacoes.appendChild(cloneDiv);
      }
    })
    .catch((err) => console.log(err));
});
