const mongoose = require("mongoose");
const utilisateurSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  cin: String,
  email: String,
  mdp: String,
  role: {
    type: String,
    enum: ["client", "admin", "vendeur", "vendeur_super"],
    default: "client",
  },
  tel: String,
  date_naissance: Date,
  sexe: { type: String, enum: ["homme", "femme"] },
  supprime: { type: Boolean, default: false },
  cree_le: { type: Date, default: Date.now },
});
const Utilisateur = mongoose.model("utilisateurs", utilisateurSchema);

module.exports = Utilisateur;
