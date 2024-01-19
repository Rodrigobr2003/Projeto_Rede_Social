document.addEventListener("DOMContentLoaded", () => {
  const descricao = document.querySelector(".descricao-text");
  const divBtn = document.querySelector(".editar-desc");
  const btnEdit = document.querySelector(".edit");
  const btnBack = document.querySelector(".back");
  const btnSalvar = document.querySelector(".save-desc");
  const input = document.querySelector(".desc-input");

  const p = document.createElement("p");
  p.innerHTML = "Adicionar descrição";

  if (descricao.innerHTML === "") divBtn.appendChild(p);

  btnEdit.addEventListener("click", () => {
    input.style.display = "block";
    btnSalvar.style.display = "block";
    descricao.style.display = "none";
    btnEdit.style.display = "none";
    p.style.display = "none";
    btnBack.style.display = "block";

    input.value = `${descricao.innerHTML}`;
  });

  btnSalvar.addEventListener("click", () => {
    input.style.display = "none";
    btnSalvar.style.display = "none";
    descricao.style.display = "block";
    btnEdit.style.display = "block";
  });

  btnBack.addEventListener("click", () => {
    input.style.display = "none";
    btnSalvar.style.display = "none";
    descricao.style.display = "block";
    btnEdit.style.display = "block";
    btnBack.style.display = "none";

    if (descricao.innerHTML === "") p.style.display = "block";
  });
});
