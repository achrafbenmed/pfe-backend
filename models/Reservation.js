const mongoose = require("mongoose");
const Produit = require("./Produit");
const Utilisateur = require("./Utilisateur");
const reservationSchema = new mongoose.Schema({
  montantTotal: Number,
  id_utilisateur: { type: mongoose.Types.ObjectId, ref: Utilisateur },
  items: [
    {
      produit: { type: mongoose.Types.ObjectId, ref: Produit },
      date_debut: Date,
      date_fin: Date,
      montant: Number,
      qte: Number,
    },
  ],
  etat: {
    type: String,
    enum: ["envoyé", "annulé", "accepté", "réfusé"],
    default: "envoyé",
  },
  supprime: { type: Boolean, default: false },
  cree_le: { type: Date, default: Date.now },
});
const Reservation = mongoose.model("reservations", reservationSchema);

module.exports = Reservation;
