require("dotenv").config();

const express = require("express");
const path = require("path");
const routes = require("./routes");
const mongoose = require("mongoose");

const app = express();

//Conectando ao mongoDB
mongoose
  .connect(process.env.CONNECTIONSTRING)
  .then(() => {
    console.log("Base de dados conectada!");
    app.emit("connection");
  })
  .catch((err) => {
    console.log(err);
  });

//Criando sessão
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const sessionOptions = session({
  secret: process.env.SECRETKEY,
  store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
});

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

//JSON -> submit method POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Utilitários
app.use(routes);
app.use(sessionOptions);
app.use(flash());

app.on("connection", () => {
  app.listen(3006, () => {
    console.log("Servidor está ligado");
    console.log(`Server esta operando: http://localhost:3006`);
  });
});
