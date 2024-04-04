const mongoose = require("mongoose");

const ImagemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  src: { type: String, required: true },
});

const ImagemModel = mongoose.model("Imagem", ImagemSchema);

module.exports = ImagemModel;
