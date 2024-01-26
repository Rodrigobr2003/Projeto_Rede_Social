document.addEventListener("DOMContentLoaded", () => {
  let rotaVolta = document.querySelector(".back");

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
