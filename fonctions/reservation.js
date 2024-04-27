const express = require("express");
const Reservation = require("../models/Reservation");
const router = express.Router();

router.get("/getAll", async (request, response) => {
  const reservation = await Reservation.find()
    .populate("id_produit")
    .populate("id_utilisateur");
  response.send(reservation);
});

router.get("/", async (request, response) => {
  const reservation = await Reservation.find({ supprime: false })
    .populate("id_produit")
    .populate("id_utilisateur");
  response.send(reservation);
});

router.post("/", (request, response) => {
  const reservation = new Reservation({
    id_produit: request.body.id_produit,
    id_utilisateur: request.body.id_utilisateur,
    date_debut: request.body.date_debut,
    date_fin: request.body.date_fin,
    montant: request.body.montant,
    etat: "envoyee",
    supprime: false,
  });
  reservation
    .save()
    .then((savedReservation) => {
      response.send(savedReservation);
    })
    .catch((erreur) => {
      console.log(erreur.message);
    });
});

router.put("/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const reservation = await Reservation.findById(id);
    if (reservation) {
      reservation.id_produit = request.body.id_produit;
      reservation.id_utilisateur = request.body.id_utilisateur;
      reservation.date_debut = request.body.date_debut;
      reservation.date_fin = request.body.date_fin;
      reservation.montant = request.body.montant;
      reservation.etat = request.body.etat;
      reservation.supprime = false;
      reservation
        .save()
        .then((savedReservation) => {
          response.send(savedReservation);
        })
        .catch((erreur) => {
          console.log(erreur.message);
        });
    } else {
      response.send("not found");
    }
  } catch (erreur) {
    response.send(erreur.message);
  }
});

router.delete("/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const reservation = await Reservation.findById(id);
    if (reservation) {
      reservation.supprime = true;
      reservation
        .save()
        .then((savedReservation) => {
          response.send(savedReservation);
        })
        .catch((erreur) => {
          console.log(erreur.message);
        });
    } else {
      response.send("not found");
    }
  } catch (erreur) {
    response.send(erreur.message);
  }
});

router.put("/restore/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const reservation = await Reservation.findById(id);
    if (reservation) {
      reservation.supprime = false;
      reservation
        .save()
        .then((savedReservation) => {
          response.send(savedReservation);
        })
        .catch((erreur) => {
          console.log(erreur.message);
        });
    } else {
      response.send("not found");
    }
  } catch (erreur) {
    response.send(erreur.message);
  }
});
module.exports = router;
