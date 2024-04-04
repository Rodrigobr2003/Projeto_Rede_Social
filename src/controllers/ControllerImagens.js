const Imagem = require("../models/ImagensModel");
const fs = require("fs");

exports.create = async (req, res) => {
  console.log("body", req.body);
  console.log("file", req.file);
};
