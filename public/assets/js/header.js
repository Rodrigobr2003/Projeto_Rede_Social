document.addEventListener("DOMContentLoaded", () => {
  const formSearchBar = document.querySelector(".form-pesquisa");
  const divPesquisa = document.querySelector(".div-pesquisa");
  const input = document.querySelector("#inputPesquisa");
  let modalPesquisa = document.querySelector(".modal-pesquisa");
  const menuIcon = document.getElementById("menu-icon");
  const navMenu = document.getElementById("nav-menu");

  menuIcon.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    menuIcon.classList.toggle("open");

    const bars = menuIcon.querySelectorAll(".bar");
    if (navMenu.classList.contains("active")) {
      bars[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      bars[1].style.opacity = "0";
      bars[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
    } else {
      bars[0].style.transform = "rotate(0) translate(0, 0)";
      bars[1].style.opacity = "1";
      bars[2].style.transform = "rotate(0) translate(0, 0)";
    }
  });

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
