const mongoose = require("mongoose");
const validator = require("validator");

const CadastroSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
  data: { type: Date, required: true },
  genero: { type: String, required: true },
});

const CadastroModel = mongoose.model("Cadastro", CadastroSchema);

class Cadastro {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async register() {
    this.validacao();

    if (this.errors.length > 0) return;

    try {
      this.user = await CadastroModel.create(this.body);
    } catch (error) {
      console.log(error);
    }
  }

  validacao() {
    this.cleanUp();

    if (!validator.isEmail(this.body.email)) this.errors.push("Email inválido");

    if (this.body.senha.length < 3 || this.body.senha.length >= 50)
      this.errors.push("Tamanho da senha deve ser entre 3 e 50 caracateres");
  }

  cleanUp() {
    for (let key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }

    this.body = {
      nome: this.body.nome,
      sobrenome: this.body.sobrenome,
      email: this.body.email,
      senha: this.body.senha,
      data: this.body.data,
      genero: this.body.genero,
    };
  }
}

module.exports = Cadastro;
