document.addEventListener("DOMContentLoaded", () => {
  const descricao = document.querySelector(".descricao-text");
  const btnEdit = document.querySelector(".editar-desc");

  if (descricao.innerHTML === "") {
    const p = document.createElement("p");
    p.innerHTML = "Adicionar descrição";

    btnEdit.appendChild(p);
  }
});
