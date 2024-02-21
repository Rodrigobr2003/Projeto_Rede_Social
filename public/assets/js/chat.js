document.addEventListener("DOMContentLoaded", () => {
  let rotaVolta = document.querySelector(".back");
  let chatForm = document.querySelector("#chat-form");
  const chat = document.querySelector(".chat");

  const urlDadosUser = "/dados-user";
  const urlDadosPesquisa = "/mostra-amigos";
  // const urlMensagens = "/carrega-mensagens";

  Promise.all([
    //
    fetch(urlDadosUser).then((response) => response.json()),
    fetch(urlDadosPesquisa).then((response) => response.json()),
    // fetch(urlMensagens).then((response) => response.json()),
    //
  ])
    .then(async (dataArray) => {
      //
      const perfilUser = dataArray[0];
      const arrayperfilPesquisa = dataArray[1];
      // const mensagens = dataArray[2];
      const perfilPesquisa = arrayperfilPesquisa[0];

      //Função de criar room
      function criarRoom(userId1, userId2) {
        // Ordena os IDs dos usuários
        const ordenarIds = [userId1, userId2].sort();

        // Cria a room com IDs ordenados
        const room = `${ordenarIds[0]}${ordenarIds[1]}`;

        return room;
      }
      const room = criarRoom(perfilUser.id, perfilPesquisa._id);

      //Carrega as mensagens

      let mensagens = undefined;

      try {
        const req = { chatRoom: room };
        const carregaMensagens = await fetch("/carrega-mensagens", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req),
        });

        mensagens = await carregaMensagens.json();
      } catch (error) {
        console.log("Erro ao carregar as mensagens: ", error);
      }

      //Chat
      const socket = io();

      //Entrar no chat
      const username = perfilUser.nome;
      socket.emit("joinChat", { username, room });

      socket.on("enviaId", (idSocket) => {
        let idMsg = perfilUser.id;

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

        chatForm.addEventListener("submit", async (e) => {
          e.preventDefault();

          let msg = e.target.msg.value;
          e.target.msg.value = "";

          try {
            let msgObj = {
              chatRoom: room,
              message: { texto: msg }, //AQUI
              idUserMsg: arrayperfilPesquisa[0]._id,
            };

            const response = await fetch("/salva-mensagens", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(msgObj),
            });

            socket.emit("chatMessage", msg, idMsg);
          } catch (err) {
            console.log("Erro ao salvar a mensagem:", err);
          }
        });

        socket.on("message", (msg) => {
          criaMensagem(msg.msg, msg.idMsg);
        });

        //Carrega mensagens
        if (mensagens.length == 0) {
          return;
        } else {
          mensagens.forEach((msg) => {
            let id = null;
            if (msg.idUser == perfilUser.id) {
              id = perfilUser.id;
            }

            criaMensagem(msg.texto, id);
          });
        }

        function criaMensagem(msg, idMsg) {
          let ultimaDiv = chat.lastElementChild;

          if (idMsg === perfilUser.id) {
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
