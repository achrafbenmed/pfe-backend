const express = require("express");
const Reservation = require("../models/Reservation");
const dayjs = require("dayjs");
var isBetween = require("dayjs/plugin/isBetween");
const Produit = require("../models/Produit");

dayjs.extend(isBetween);
const router = express.Router();

router.get("/getAll", async (request, response) => {
  const reservation = await Reservation.find()
    .sort({
      cree_le: -1,
    })
    .populate("id_produit")
    .populate("id_utilisateur");
  response.send(reservation);
});

router.get("/", async (request, response) => {
  const reservation = await Reservation.find({ supprime: false })
    .sort({
      cree_le: -1,
    })
    .populate("id_produit")
    .populate("id_utilisateur");
  response.send(reservation);
});

router.post("/", async (request, response) => {
  const { id_produit, id_utilisateur, date_debut, date_fin, montant } =
    request.body;
  const reservation = new Reservation({
    id_produit: id_produit,
    id_utilisateur: id_utilisateur,
    date_debut: date_debut,
    date_fin: date_fin,
    montant: montant,
  });
  const produit = await Produit.findById(id_produit);
  const reservations = await Reservation.find({
    id_produit: id_produit,
  });
  const chevauchements = reservations.filter((r) => {
    console.log(
      dayjs(r.date_debut).format("YYYY-MM-DD"),
      dayjs(date_debut).format("YYYY-MM-DD"),
      dayjs(r.date_debut).format("YYYY-MM-DD") ===
        dayjs(date_debut).format("YYYY-MM-DD")
    );
    return (
      (dayjs(date_debut).isBetween(r.date_debut, r.date_fin) ||
        dayjs(date_fin).isBetween(r.date_debut, r.date_fin) ||
        dayjs(r.date_debut).isBetween(date_debut, date_fin) ||
        dayjs(r.date_fin).isBetween(date_debut, date_fin) ||
        dayjs(r.date_debut).format("YYYY-MM-DD") ===
          dayjs(date_debut).format("YYYY-MM-DD") ||
        dayjs(r.date_debut).format("YYYY-MM-DD") ===
          dayjs(date_fin).format("YYYY-MM-DD") ||
        dayjs(r.date_fin).format("YYYY-MM-DD") ===
          dayjs(date_debut).format("YYYY-MM-DD") ||
        dayjs(r.date_fin).format("YYYY-MM-DD") ===
          dayjs(date_fin).format("YYYY-MM-DD")) &&
      r.etat === "accepté"
    );
  });

  console.log(chevauchements.length);
  if (produit.qte > chevauchements.length) {
    reservation
      .save()
      .then((savedReservation) => {
        response.send(savedReservation);
      })
      .catch((erreur) => {
        console.log(erreur.message);
      });
  } else {
    response.status(403).send("produit indisponible pour cette datte");
  }
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
