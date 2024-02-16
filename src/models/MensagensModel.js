const mongoose = require("mongoose");

const MensagemSchema = new mongoose.Schema({
  chatRoom: { type: String, required: true },
  mensagem: [
    {
      texto: { type: String, required: true, default: "" },
      idUser: { type: String, required: false, default: "" },
      curtidas: [
        {
          idUser: { type: String, required: false, default: "" },
          _id: false,
        },
      ],
      comentarios: [
        {
          idUser: { type: String, required: false, default: "" },
          coment: { type: String, required: false, default: "" },
        },
      ],
      tempo: { type: Date, required: false },
      image: { type: String, required: false },
    },
  ],
});

const MensagemModel = mongoose.model("Mensagem", MensagemSchema);

class Mensagem {
  constructor(body) {
    this.body = body;
  }

  async registrarMensagem(room, idUser) {
    let mensagem = await MensagemModel.findOne({ chatRoom: room }).exec();

    if (mensagem) {
      mensagem = await MensagemModel.findOneAndUpdate(
        { chatRoom: room },
        { $addToSet: { mensagem: [{ texto: this.body, idUser: idUser }] } },
        { new: true }
      );
    } else {
      mensagem = await MensagemModel.create({
        chatRoom: room,
        mensagem: [
          {
            texto: this.body,
            idUser: idUser,
          },
        ],
      });
    }

    return mensagem;
  }

  async carregaMensagens(room) {
    try {
      const mensagens = await MensagemModel.findOne({ chatRoom: room }).exec();

      if (!mensagens) return { mensagem: [] };

      return { mensagem: mensagens };
    } catch (error) {
      console.log(error);
    }
  }

  async adicionarCurtida(room, index, idUser) {
    let chat = await MensagemModel.findOne({ chatRoom: room }).exec();

    const caminhoCurtida = `mensagem.${index}.curtidas`;

    chat = await MensagemModel.findOneAndUpdate(
      { chatRoom: room },
      { $addToSet: { [caminhoCurtida]: { idUser } } },
      { new: true }
    ).exec();
  }

  async removerCurtida(room, index, idUser) {
    let chat = await MensagemModel.findOne({ chatRoom: room }).exec();

    const caminhoCurtida = `mensagem.${index}.curtidas`;

    chat = await MensagemModel.findOneAndUpdate(
      { chatRoom: room },
      { $pull: { [caminhoCurtida]: { idUser } } },
      { new: true }
    ).exec();
  }
}

module.exports = Mensagem;
