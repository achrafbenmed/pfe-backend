const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const categorieRouter = require("./fonctions/categorie");
const produitRouter = require("./fonctions/produit");
const reservationRouter = require("./fonctions/reservation");
const utilisateurRouter = require("./fonctions/utilisateur");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));
mongoose
  .connect("mongodb://127.0.0.1:27017/location")
  .then(() => {
    console.log("connecté à la base des données");
  })
  .catch((erreur) => {
    console.log(erreur.message);
  });

app.use("/categorie", categorieRouter);
app.use("/reservation", reservationRouter);
app.use("/produit", produitRouter);
app.use("/utilisateur", utilisateurRouter);

app.listen(5000, () => {
  console.log("serveur ouvert sur le port 5000");
});
