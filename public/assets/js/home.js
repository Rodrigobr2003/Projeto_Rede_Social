document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".input-atividade");
  const feedChat = document.querySelector(".feed-chat");

  fetch("/dados-user", { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      const socket = io();

      let username = `${data.nome} ${data.sobrenome}`;
      let userId = data.id;
      let room = "feed:1729232020";

      //Join chat
      socket.emit("joinChat", { username, room });

      //Listener msgs feed
      socket.on("feedMessage", (msg, id, name) => {
        criarMensagem(msg, name);
      });

      //Submit form
      form.addEventListener("submit", async function (e) {
        e.preventDefault();

        let texto = e.target.msg.value;
        e.target.msg.value = "";

        try {
          let msgObj = {
            chatRoom: room,
            message: { texto: texto },
          };

          const response = await fetch("/salva-mensagens", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(msgObj),
          });

          socket.emit("feedChat", texto, userId, username);
        } catch (error) {
          console.log("Erro ao salvar mensagens no BD: ", error);
        }
      });

      //Criar layout msg
      function criarMensagem(msg, name) {
        const publiOriginal = document.querySelector(".feed-default.publi");

        const novaPubli = publiOriginal.cloneNode(true);

        novaPubli.querySelector(".userName").textContent = name;
        novaPubli.querySelector(".texto").textContent = msg;

        novaPubli.style.display = "block";
        feedChat.prepend(novaPubli);
      }
    })
    .catch((err) => console.log(err));
});
