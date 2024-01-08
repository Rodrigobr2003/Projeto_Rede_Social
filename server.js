const express = require("express");
const path = require("path");
const routes = require("./routes");

const app = express();

//Setando engine EJS
app.set("views", [
  path.resolve(__dirname, "src", "views"),
  path.resolve(__dirname, "src", "views", "includes"),
]);
app.set("view engine", "ejs");

//Caminhos CSS, Imagens e JS
app.use(express.static(path.resolve(__dirname, "public", "assets", "css")));
app.use(express.static(path.resolve(__dirname, "public", "assets", "images")));
app.use(express.static(path.resolve(__dirname, "public", "assets", "js")));

//Utilitários
app.use(routes);

app.listen(3006, () => {
  console.log("Servidor está ligado");
  console.log(`Server esta operando: http://localhost:3006`);
});
