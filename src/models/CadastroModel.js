const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const CadastroSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: true },
  email: { type: String, required: true },
  senha: { type: String, required: true },
  data: { type: Date, required: true },
  genero: { type: String, required: true },
  descricao: { type: String, required: false, default: "" },
  amigos: { type: Array, required: false, default: [] },
  notificacoes: { type: Array, required: false, default: [] },
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

    await this.userExist();

    if (this.errors.length > 0) return;

    const salt = bcrypt.genSaltSync();
    this.body.senha = bcrypt.hashSync(this.body.senha, salt);

    this.user = await CadastroModel.create(this.body);
  }

  validacao() {
    this.cleanUp();

    if (this.errors.length > 0) return;

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
      descricao: this.body.descricao,
      amigos: this.body.amigos,
      notificacoes: this.body.notificacoes,
    };
  }

  async userExist() {
    this.user = await CadastroModel.findOne({ email: this.body.email });

    if (this.user) this.errors.push("O email já foi cadastrado");
  }

  async login() {
    this.validacao();

    if (this.errors.length > 0) return;

    this.user = await CadastroModel.findOne({ email: this.body.email });

    if (!this.user) {
      this.errors.push("Usuário não existe");
      return;
    }

    if (!bcrypt.compareSync(this.body.senha, this.user.senha)) {
      this.errors.push("Senha inválida ou incorreta");
      return;
    }
  }

  static async buscaId(id) {
    if (typeof id !== "string") return;

    const user = await CadastroModel.findById(id, { senha: 0 });

    return user;
  }

  async recuperaDados(nome) {
    let userName = nome;
    this.user = await CadastroModel.find({ nome: userName }, { senha: 0 });

    if (!this.user) return;

    return this.user;
  }

  async editar(id) {
    if (this.errors.length > 0) return;

    this.user = await CadastroModel.findByIdAndUpdate(id, this.body, {
      new: true,
    });
  }

  async adicionarNotificacao(id) {
    if (this.errors.length > 0) return;

    const novaNotf = this.body;

    this.user = await CadastroModel.findByIdAndUpdate(
      id,
      {
        $push: { notificacoes: novaNotf },
      },
      { new: true }
    );

    return this.user;
  }

  async removerPedidoAmigo(id, index) {
    if (this.errors.length > 0) return;

    this.user = await CadastroModel.findById(id);

    this.user = await CadastroModel.findByIdAndUpdate(
      id,
      { $pull: { notificacoes: this.user.notificacoes[index] } },
      { new: true }
    );

    return this.user;
  }

  async aceitarPedidoAmigo(id, index, idAmigo, dataUser) {
    if (this.errors.length > 0) return;

    this.user = await CadastroModel.findById(id);

    this.user = await CadastroModel.findByIdAndUpdate(
      id,
      { $addToSet: { amigos: this.body } },
      { new: true }
    );

    let amigo = await CadastroModel.findById(idAmigo);

    amigo = await CadastroModel.findByIdAndUpdate(
      idAmigo,
      { $addToSet: { amigos: dataUser } },
      { new: true }
    );

    await this.removerPedidoAmigo(id, index);

    return this.user;
  }

  async removerAmigo(userId, index, idAmigo, indexAmigo) {
    if (this.errors.length > 0) return;

    this.user = await CadastroModel.findById(userId);

    this.user = await CadastroModel.findByIdAndUpdate(
      userId,
      { $pull: { amigos: this.user.amigos[index] } },
      { new: true }
    );

    let amigo = await CadastroModel.findById(idAmigo);

    amigo = await CadastroModel.findByIdAndUpdate(
      idAmigo,
      { $pull: { amigos: amigo.amigos[indexAmigo] } },
      { new: true }
    );

    return this.user;
  }

  async excluirNotificacao(id, index) {
    if (this.errors.length > 0) return;

    const user = await CadastroModel.findById(id);

    if (!user) {
      return;
    }

    user.notificacoes.splice(index, 1);

    await user.save();

    return user;
  }
}

module.exports = Cadastro;
