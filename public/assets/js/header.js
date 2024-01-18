document.addEventListener("DOMContentLoaded", () => {
  const formSearchBar = document.querySelector(".form-pesquisa");
  const divPesquisa = document.querySelector(".div-pesquisa");
  const input = document.querySelector("#inputPesquisa");
  let modalPesquisa = document.querySelector(".modal-pesquisa");

  formSearchBar.addEventListener("click", (event) => {
    event.stopPropagation();
    modalPesquisa.style.display = "flex";
  });

  document.addEventListener("click", () => {
    if ((modalPesquisa.style.display = "flex"))
      modalPesquisa.style.display = "none";
  });

  formSearchBar.addEventListener("input", async function (event) {
    if (modalPesquisa.childElementCount > 0) {
      while (modalPesquisa.firstChild) {
        modalPesquisa.removeChild(modalPesquisa.firstChild);
      }
    }

    let pesquisa = document.querySelector("#inputPesquisa").value;

    pesquisa =
      pesquisa.charAt(0).toUpperCase() + pesquisa.slice(1).toLowerCase();

    const respostaPesquisa = await fetch(
      `/pesquisa-user?pesquisa=${encodeURIComponent(pesquisa)}`
    );

    const data = await respostaPesquisa.json();
    const users = data.user;

    users.map((user) => {
      const idUser = user._id;

      const formUser = document.createElement("form");
      formUser.action = `/searched-user/${idUser}`;
      formUser.method = "GET";

      const button = document.createElement("button");
      button.classList.add("div-user");

      const img = document.createElement("img");
      img.src = "/profile-default.png";

      const h4 = document.createElement("h4");
      h4.innerHTML = `${user.nome} ${user.sobrenome}`;
      h4.style.color = "black";

      formUser.appendChild(button);

      button.appendChild(img);
      button.appendChild(h4);

      modalPesquisa.appendChild(formUser);

      button.style.display = "flex";
    });
  });
});
