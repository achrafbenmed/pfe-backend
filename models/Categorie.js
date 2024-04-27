const mongoose = require("mongoose");
const categorieSchema = new mongoose.Schema({
  nom: String,
  supprime: Boolean,
  cree_le: { type: Date, default: Date.now },
});
const Categorie = mongoose.model("categories", categorieSchema);

module.exports = Categorie;
