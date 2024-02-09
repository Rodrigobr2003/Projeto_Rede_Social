document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".input-atividade");
  const feedChat = document.querySelector(".feed-chat");

  fetch("/dados-user", { method: "GET" })
    .then((response) => response.json())
    .then(async (data) => {
      const socket = io();

      let username = `${data.nome} ${data.sobrenome}`;
      let userId = data.id;
      let room = "feed:1729232020";

      //Join chat
      socket.emit("joinChat", { username, room });

      //Carrega as mensagens do chat
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

        for (i in mensagens) {
          const msg = mensagens[i].texto;
          const id = mensagens[i].idUser;
          const profileName = await procuraPerfil(id);

          criarMensagem(msg, profileName);
        }
      } catch (error) {
        console.log("Erro ao carregar as mensagens: ", error);
      }

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

      //#region Funções do sistema:
      //Criar layout msg
      function criarMensagem(msg, name) {
        const publiOriginal = document.querySelector(".feed-default.publi");

        const novaPubli = publiOriginal.cloneNode(true);

        novaPubli.querySelector(".userName").textContent = name;
        novaPubli.querySelector(".texto").textContent = msg;

        novaPubli.style.display = "block";
        feedChat.prepend(novaPubli);
      }

      async function procuraPerfil(id) {
        const req = { userId: id };
        const response = await fetch("/procura-perfil", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(req),
        });

        const profileObj = await response.json();

        const profileName = `${profileObj.nome} ${profileObj.sobrenome}`;

        return profileName;
      }

      //#endregion
    })
    .catch((err) => console.log(err));
});
