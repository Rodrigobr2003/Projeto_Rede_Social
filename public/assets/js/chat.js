document.addEventListener("DOMContentLoaded", () => {
  let rotaVolta = document.querySelector(".back");
  let chatForm = document.querySelector("#chat-form");

  fetch("/mostra-amigos")
    .then((response) => response.json())
    .then((data) => {
      let nomeUser = document.querySelector(".nomeUser");

      let idUser = data[0]._id;

      nomeUser.innerHTML = `${data[0].nome} ${data[0].sobrenome}`;

      rotaVolta.href = `/searched-user/${idUser}`;

      //Chat
      const socket = io();

      //Entrar no chat
      socket.emit("joinChat", data[0].nome);

      socket.on("alert", (msg) => {
        alerta(msg);
      });

      function alerta(msg) {
        const divFriend = document.querySelector(".friend-msg").cloneNode(true);
        const divFriendSide = document.querySelector(".friend-side");

        divFriend.innerHTML = msg;
        divFriend.style.display = "flex";
        divFriend.classList.add("notf");

        divFriendSide.append(divFriend);
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

      function mensagem(msg) {
        const divUser = document.querySelector(".user-msg").cloneNode(true);
        const divUserSide = document.querySelector(".user-side");

        divUser.innerHTML = msg;
        divUser.style.display = "flex";

        divUserSide.appendChild(divUser);
      }
    })
    .catch((err) => console.log(err));
});
