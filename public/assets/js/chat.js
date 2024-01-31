document.addEventListener("DOMContentLoaded", () => {
  let rotaVolta = document.querySelector(".back");
  let chatForm = document.querySelector("#chat-form");
  const chat = document.querySelector(".chat");

  const urlDadosUser = "/dados-user";
  const urlDadosPesquisa = "/mostra-amigos";

  Promise.all([
    //
    fetch(urlDadosUser).then((response) => response.json()),
    fetch(urlDadosPesquisa).then((response) => response.json()),
    //
  ])
    .then((dataArray) => {
      //
      const perfilUser = dataArray[0];
      const arrayperfilPesquisa = dataArray[1];
      const perfilPesquisa = arrayperfilPesquisa[0];

      //Definindo room(idUser + idFriend)
      const room = perfilUser.id;
      //Chat
      const socket = io();

      //Entrar no chat
      socket.emit("joinChat", perfilUser.nome);

      socket.on("enviaId", (idSocket) => {
        let idUser = idSocket;

        socket.on("alert", (msg) => {
          alerta(msg);
        });

        function alerta(msg) {
          let ultimaDiv = chat.lastElementChild;
          const divFriend = document
            .querySelector(".friend-msg")
            .cloneNode(true);
          const divFriendSide = document
            .querySelector(".friend-side")
            .cloneNode(true);

          divFriend.innerHTML = msg;
          divFriend.style.display = "flex";
          divFriend.classList.add("notf");
          divFriendSide.firstElementChild.remove();

          if (ultimaDiv) {
            divFriendSide.appendChild(divFriend);
            ultimaDiv.insertAdjacentElement("afterend", divFriendSide);
          } else {
            divFriendSide.append(divFriend);
          }
        }

        chatForm.addEventListener("submit", (e) => {
          e.preventDefault();

          let msg = e.target.msg.value;
          e.target.msg.value = "";

          socket.emit("chatMessage", msg);
        });

        socket.on("message", (msg) => {
          mensagem(msg);
        });

        function mensagem({ msg, idSocket }) {
          let ultimaDiv = chat.lastElementChild;
          if (idSocket === idUser) {
            const divUser = document.querySelector(".user-msg").cloneNode(true);
            const divUserSide = document
              .querySelector(".user-side")
              .cloneNode(true);

            divUser.innerHTML = msg;
            divUser.style.display = "flex";
            divUserSide.firstElementChild.remove();

            if (ultimaDiv) {
              divUserSide.appendChild(divUser);
              ultimaDiv.insertAdjacentElement("afterend", divUserSide);
            }
          } else {
            const divFriend = document
              .querySelector(".friend-msg")
              .cloneNode(true);
            const divFriendSide = document
              .querySelector(".friend-side")
              .cloneNode(true);

            divFriend.innerHTML = msg;
            divFriend.style.display = "flex";
            divFriendSide.firstElementChild.remove();

            if (ultimaDiv) {
              divFriendSide.appendChild(divFriend);

              if (divFriendSide.children.length >= 2) {
                divFriendSide.firstElementChild.remove();
              }
              ultimaDiv.insertAdjacentElement("afterend", divFriendSide);
            }
          }

          chat.scrollTop = chat.scrollHeight;
        }
      });

      let nomeUser = document.querySelector(".nomeUser");
      let idUser = perfilPesquisa._id;

      nomeUser.innerHTML = `${perfilPesquisa.nome} ${perfilPesquisa.sobrenome}`;
      rotaVolta.href = `/searched-user/${idUser}`;
    })
    .catch((err) => console.log("Erro ao fazer requisição simultânea: ", err));
});
