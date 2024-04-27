const mongoose = require("mongoose");
const Produit = require("./Produit");
const Utilisateur = require("./Utilisateur");
const reservationSchema = new mongoose.Schema({
  id_produit: { type: mongoose.Types.ObjectId, ref: Produit },
  id_utilisateur: { type: mongoose.Types.ObjectId, ref: Utilisateur },
  date_debut: Date,
  date_fin: Date,
  montant: Number,
  etat: { type: String, enum: ["envoyé", "annulé", "accepté", "réfusé"] },
  supprime: Boolean,
  cree_le: { type: Date, default: Date.now },
});
const Reservation = mongoose.model("reservations", reservationSchema);

module.exports = Reservation;
