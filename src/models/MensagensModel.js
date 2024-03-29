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
          comment: { type: String, required: false, default: "" },
          _id: false,
        },
      ],
      tempo: { type: String, required: false, default: "" },
      image: { type: String, required: false, default: "" },
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
        {
          $addToSet: {
            mensagem: [
              {
                texto: this.body.texto,
                idUser: idUser,
                tempo: this.body.tempo,
              },
            ],
          },
        },
        { new: true }
      );
    } else {
      mensagem = await MensagemModel.create({
        chatRoom: room,
        mensagem: [
          {
            texto: this.body.texto,
            idUser: idUser,
            tempo: this.body.tempo,
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
    try {
      let chat = await MensagemModel.findOne({ chatRoom: room }).exec();

      const caminhoCurtida = `mensagem.${index}.curtidas`;

      chat = await MensagemModel.findOneAndUpdate(
        { chatRoom: room },
        { $addToSet: { [caminhoCurtida]: { idUser } } },
        { new: true }
      ).exec();
    } catch (error) {
      console.log("Erro ao adicionar curtida: ", error);
    }
  }

  async removerCurtida(room, index, idUser) {
    try {
      let chat = await MensagemModel.findOne({ chatRoom: room }).exec();

      const caminhoCurtida = `mensagem.${index}.curtidas`;

      chat = await MensagemModel.findOneAndUpdate(
        { chatRoom: room },
        { $pull: { [caminhoCurtida]: { idUser } } },
        { new: true }
      ).exec();
    } catch (error) {
      console.log("Erro ao remover curtida: ", error);
    }
  }

  async adicionarComentario(room, index, comentario, idUser) {
    try {
      let chat = await MensagemModel.findOne({ chatRoom: room }).exec();

      const caminhoComment = `mensagem.${index}.comentarios`;

      chat = await MensagemModel.findOneAndUpdate(
        { chatRoom: room },
        {
          $addToSet: {
            [caminhoComment]: { idUser: idUser, comment: comentario },
          },
        },
        { new: true }
      );
    } catch (error) {
      console.log("Erro ao adicionar comentario: ", error);
    }
  }

  async carregarComentarios(room) {
    try {
      let chat = await MensagemModel.findOne({ chatRoom: room }).exec();

      if (!chat) return { comentarios: [] };

      const mensagens = chat.mensagem;

      return mensagens;
    } catch (error) {
      console.log("Erro ao carregar comentarios: ", error);
    }
  }

  async removerComentario(idUser, index, room) {
    try {
      const comment = await MensagemModel.findOne({ chatRoom: room });

      if (!comment) {
        throw new Error("Room do comentario não encontrado");
      }

      if (idUser !== comment.mensagem[index].idUser) {
        throw new Error("Id da mensagem é diferente do usuário");
      }

      comment.mensagem.splice(index, 1);

      await comment.save();

      return comment;
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Mensagem;
