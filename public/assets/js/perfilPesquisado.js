document.addEventListener("DOMContentLoaded", () => {
  const urlAmigosPerfilPesquisado = "/mostra-amigos";
  const urlDadosUser = "/dados-user";

  const formAdd = document.querySelector("#form-add-amigo");
  const formExc = document.querySelector("#form-remove-amigo");
  const amigosTag = document.querySelector(".amigos");

  async function fetchAmigo() {
    try {
      const [response1, response2] = await Promise.all([
        fetch(urlAmigosPerfilPesquisado),
        fetch(urlDadosUser),
      ]);

      const userPesquisado = await response1.json();
      const dataUser = await response2.json();

      let userPesquisadoId = userPesquisado[0]._id;

      const formChat = document.querySelector(".form-chat");
      formChat.action = `/searched-user/:${userPesquisadoId}/chat-profile`;

      const amigos = userPesquisado[0].amigos;

      if (amigos.length === 0) formAdd.style.display = "flex";

      if (amigos.length == 1) amigosTag.innerHTML = `${amigos.length} amigo`;
      if (amigos.length == 0 || amigos.length > 1)
        amigosTag.innerHTML = `${amigos.length} amigos`;

      amigos.map((amigo) => {
        if (amigo.idSolicitante === dataUser.id) {
          formExc.style.display = "flex";
        } else {
          formAdd.style.display = "flex";
        }
      });
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  }

  fetchAmigo();
});
