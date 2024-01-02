const express = require("express");
const path = require("path");
const routes = require("./routes");

const app = express();

//Setando engine EJS
app.set("views", path.resolve(__dirname, "src", "views"));
app.set("view engine", "ejs");

//Caminhos CSS e Imagens
app.use(express.static(path.resolve(__dirname, "public", "assets", "css")));
app.use(express.static(path.resolve(__dirname, "public", "assets", "images")));

//Utilitários
app.use(routes);

app.listen(3006, () => {
  console.log("Servidor está ligado");
  console.log(`Server esta operando: http://localhost:3006`);
});
