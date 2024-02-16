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
          const msgId = mensagens[i]._id;
          const numCurtidas = mensagens[i].curtidas.length;
          let like = false;

          //Verifica curtida
          for (c in mensagens[i].curtidas) {
            if (mensagens[i].curtidas[c].idUser == userId) {
              like = true;
              break;
            }
          }

          criarMensagem(msg, profileName, msgId, numCurtidas, like);
        }
      } catch (error) {
        console.log("Erro ao carregar as mensagens: ", error);
      }

      //Click btn
      const likeBnt = document.querySelectorAll(".like-btn");

      likeBnt.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          let indexMsg = undefined;

          for (let i = 0; i < mensagens.length; i++) {
            const teste = mensagens[i];
            if (teste._id === e.target.id) {
              indexMsg = i;
            }
          }

          if (e.target.innerHTML.includes("regular")) {
            curtirMensagem(e.target);

            const reqObj = {
              chatRoom: room,
              index: indexMsg,
              idUser: data.id,
            };

            await fetch("/curtir-mensagem", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(reqObj),
            });

            return;
          } else if (e.target.innerHTML.includes("solid")) {
            removerCurtida(e.target);

            const reqObj = {
              chatRoom: room,
              index: indexMsg,
              idUser: data.id,
            };

            await fetch("/remover-curtida", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(reqObj),
            });
          }
        });
      });

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
      function criarMensagem(msg, name, idMsg, numCurtidas, like) {
        const publiOriginal = document.querySelector(".feed-default.publi");

        const novaPubli = publiOriginal.cloneNode(true);

        novaPubli.querySelector(".userName").textContent = name;
        novaPubli.querySelector(".texto").textContent = msg;

        novaPubli.querySelector(".like-btn").id = idMsg;

        if (numCurtidas == 0) {
          novaPubli.querySelector(".numCurtidas").innerHTML = "";
        }

        if (numCurtidas == 1) {
          novaPubli.querySelector(
            ".numCurtidas"
          ).innerHTML = `${numCurtidas} curtida`;
        }

        if (numCurtidas > 1) {
          novaPubli.querySelector(
            ".numCurtidas"
          ).innerHTML = `${numCurtidas} curtidas`;
        }

        if (like) {
          novaPubli.querySelector("i").classList.remove("fa-regular");
          novaPubli.querySelector("i").classList.add("fa-solid");
          novaPubli.querySelector("span").innerHTML = "Curtido";
        }

        if (!like) {
          novaPubli.querySelector("i").classList.remove("fa-solid");
          novaPubli.querySelector("i").classList.add("fa-regular");
          novaPubli.querySelector("span").innerHTML = "Curtir";
        }

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

      function curtirMensagem(target) {
        const span = target.querySelector("span");
        const i = target.querySelector("i");

        i.classList.remove("fa-regular");
        i.classList.add("fa-solid");
        span.innerHTML = "Curtido";
      }

      function removerCurtida(target) {
        const span = target.querySelector("span");
        const i = target.querySelector("i");

        i.classList.remove("fa-solid");
        i.classList.add("fa-regular");
        span.innerHTML = "Curtir";
      }

      //#endregion
    })
    .catch((err) => console.log(err));
});
