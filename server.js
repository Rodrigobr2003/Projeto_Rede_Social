require("dotenv").config();

const express = require("express");
const path = require("path");
const routes = require("./routes");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const http = require("http");
const socketio = require("socket.io");

const {
  flashMessagesMiddleware,
} = require("./src/middlewares/middlewaresGlobais");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

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

//Conectando ao chat
io.on("connection", (socket) => {
  //Join chat
  socket.on("joinChat", (nomePesquisado) => {
    socket.broadcast.emit("alert", `${nomePesquisado} conectou-se`);

    //Listener de mensagens
    socket.on("chatMessage", (msg) => {
      io.emit("message", msg);
    });

    //Disconnect chat
    socket.on("disconnect", () => {
      io.emit("alert", `${nomePesquisado} desconectou-se`);
    });
  });
});

//Utilitários
app.use(flash());
app.use(sessionOptions);
app.use(flashMessagesMiddleware);
app.use(routes);

app.on("connection", () => {
  server.listen(3006, () => {
    console.log("Servidor está ligado");
    console.log(`Server esta operando: http://localhost:3006`);
  });
});
