const mongoose = require("mongoose");
const Categorie = require("./Categorie");
const produitSchema = new mongoose.Schema({
  nom: String,
  prix: Number,
  qte: Number,
  taille: Number,
  supprime: { type: Boolean, default: false },
  image: String,
  idCategorie: { type: mongoose.Schema.Types.ObjectId, ref: Categorie },
  cree_le: { type: Date, default: Date.now },
});
const Produit = mongoose.model("produits", produitSchema);

module.exports = Produit;
