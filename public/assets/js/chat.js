document.addEventListener("DOMContentLoaded", () => {
  let rotaVolta = document.querySelector(".back");
  let chatForm = document.querySelector("#chat-form");
  const chat = document.querySelector(".chat");

  fetch("/dados-user", { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      const perfilUser = data;
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
    })
    .catch((err) => {
      console.log("Erro ao fazer fetch do user: ", err);
    });

  fetch("/mostra-amigos")
    .then((response) => response.json())
    .then((data) => {
      let nomeUser = document.querySelector(".nomeUser");

      let idUser = data[0]._id;

      nomeUser.innerHTML = `${data[0].nome} ${data[0].sobrenome}`;

      rotaVolta.href = `/searched-user/${idUser}`;
    })
    .catch((err) => console.log(err));
});
