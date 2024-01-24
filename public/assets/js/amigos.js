document.addEventListener("DOMContentLoaded", () => {
  let divAmigos = document.querySelector(".perfil-amigo");

  fetch("carrega-amigos", { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      const listaAmigos = data;

      if (listaAmigos.length == 0) {
        let divPerfilAmigo = document.querySelector(".perfil-feed");
        divPerfilAmigo.style.display = "none";

        let avisoNotif = document.querySelector(".aviso-notif");
        avisoNotif.style.display = "flex";

        return;
      }

      for (a in listaAmigos) {
        let nomeAmigo = listaAmigos[a].nomeSolicitante;
        let sobrenomeAmigo = listaAmigos[a].sobrenomeSolicitante;

        let divFeed = document.querySelector(".perfil-feed").cloneNode(true);
        divFeed.style.display = "flex";

        let userName = divFeed.querySelector(".userName");
        userName.innerHTML = `${nomeAmigo} ${sobrenomeAmigo}`;

        divAmigos.appendChild(divFeed);
      }
    })
    .catch((err) => console.log(err));
});
