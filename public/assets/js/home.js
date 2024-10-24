document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".input-atividade");
  const feedChat = document.querySelector(".feed-chat");

  if (window.screen.width <= 500) {
    const inputForm = document.querySelector("#msg");
    inputForm.placeholder = "Publique algo...";
  }

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
          const tempo = mensagens[i].tempo;
          let like = false;

          //Verifica curtida
          for (c in mensagens[i].curtidas) {
            if (mensagens[i].curtidas[c].idUser == userId) {
              like = true;
              break;
            }
          }
          criarMensagem(
            id,
            msg,
            profileName,
            tempo,
            msgId,
            numCurtidas,
            like,
            i
          );

          if (mensagens.length > 0)
            document.querySelector("section").style.height = "130vh";
        }
      } catch (error) {
        console.log("Erro ao carregar as mensagens: ", error);
      }

      //Click btn curtir
      const likeBnt = document.querySelectorAll(".like-btn");
      likeBnt.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          let indexMsg = undefined;
          let saveId = undefined;

          for (let i = 0; i < mensagens.length; i++) {
            const teste = mensagens[i];

            if (teste._id === e.target.id) {
              indexMsg = i;
              saveId = teste.idUser;
            }
          }

          if (e.target.innerHTML.includes("regular")) {
            curtirMensagem(e.target);

            const reqObj = {
              chatRoom: room,
              index: indexMsg,
              idUser: data.id,
              idUserMsg: saveId,
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

      //Click abrir comentario
      const commentBnt = document.querySelectorAll(".comment-btn");
      commentBnt.forEach((btn) => {
        let mensagensCarregadas = false;
        btn.addEventListener("click", async (e) => {
          const divPubli = e.target.parentNode.parentNode;
          const commentSec = divPubli.querySelector(".comentarios");
          const id = divPubli.querySelector(".comment-btn").id;

          commentSec.querySelector(".form-comment").id = id;

          const estiloDisplay = window
            .getComputedStyle(commentSec)
            .getPropertyValue("display");

          if (estiloDisplay === "none") commentSec.style.display = "block";
          if (estiloDisplay === "block") commentSec.style.display = "none";

          let data = undefined;
          let listComments = [];

          if (!mensagensCarregadas) {
            const reqObj = {
              chatRoom: room,
            };

            const response = await fetch("/carrega-comentarios", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(reqObj),
            });

            data = await response.json();

            let indexMsg = undefined;
            for (let i = 0; i < mensagens.length; i++) {
              const teste = mensagens[i];
              if (teste._id === e.target.id) {
                indexMsg = i;
              }
            }

            listComments = data[indexMsg].comentarios;

            mensagensCarregadas = true;
          }

          for (const c of listComments) {
            const comment = c.comment;
            const idUser = c.idUser;
            const profileName = await procuraPerfil(idUser);

            criarComentario(profileName, comment, commentSec);
          }
        });
      });

      //Listener msgs feed
      socket.on("feedMessage", (msg, id, name, tempo) => {
        criarMensagem(userId, msg, name, tempo);
      });

      //Submit form
      form.addEventListener("submit", async function (e) {
        e.preventDefault();

        let texto = e.target.msg.value;
        e.target.msg.value = "";

        try {
          let msgObj = {
            chatRoom: room,
            message: { texto: texto, tempo: "" },
          };

          const response = await fetch("/salva-mensagens", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(msgObj),
          });

          const teste = await response.json();
          const tempo = teste.body.tempo;

          socket.emit("feedChat", texto, userId, username, tempo);
        } catch (error) {
          console.log("Erro ao salvar mensagens no BD: ", error);
        }
      });

      //Submit comment
      const commentInputList = document.querySelectorAll(".form-comment");

      commentInputList.forEach((input) => {
        input.addEventListener("submit", async (e) => {
          e.preventDefault();
          let saveId = undefined;
          const divComentario = e.target.parentNode.parentNode;

          let indexMsg = undefined;
          for (let i = 0; i < mensagens.length; i++) {
            const teste = mensagens[i];
            if (teste._id === e.target.id) {
              indexMsg = i;
              saveId = teste.idUser;
            }
          }

          const comentario = e.target.comment.value;

          e.target.comment.value = "";

          criarComentario(username, comentario, divComentario);

          const objMsg = {
            comentario: comentario,
            index: indexMsg,
            chatRoom: room,
            idUser: data.id,
            idUserMsg: saveId,
          };

          await fetch("/salva-comentario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(objMsg),
          });
        });
      });

      //#region Funções do sistema:
      //Criar layout msg
      function criarMensagem(
        id,
        msg,
        name,
        tempo,
        idMsg,
        numCurtidas,
        like,
        index
      ) {
        const publiOriginal = document.querySelector(".feed-default.publi");

        const novaPubli = publiOriginal.cloneNode(true);

        novaPubli.querySelector(".userName").textContent = name;
        novaPubli.querySelector(".texto").textContent = msg;
        novaPubli.querySelector(".tempo").textContent = tempo;

        novaPubli.querySelector(".like-btn").id = idMsg;
        novaPubli.querySelector(".comment-btn").id = idMsg;
        novaPubli.querySelector(".share-btn").id = idMsg;

        if (index) novaPubli.querySelector(".value").value = index;

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
          novaPubli.querySelector(".anx").classList.remove("fa-regular");
          novaPubli.querySelector(".anx").classList.add("fa-solid");
          novaPubli.querySelector("span").innerHTML = "Curtido";
        }

        if (!like) {
          novaPubli.querySelector(".anx").classList.remove("fa-solid");
          novaPubli.querySelector(".anx").classList.add("fa-regular");
          novaPubli.querySelector("span").innerHTML = "Curtir";
        }

        if (id === userId) {
          novaPubli.querySelector(".form-apagar").style.display = "block";
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

      function criarComentario(name, comment, section) {
        const commentOriginal = document.querySelector(".user");

        const novoComment = commentOriginal.cloneNode(true);

        novoComment.querySelector(".comment-name").textContent = name;
        novoComment.querySelector(".comment").textContent = comment;

        novoComment.style.display = "flex";
        section.appendChild(novoComment);
      }

      //#endregion
    })
    .catch((err) => console.log(err));
});
