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
    .populate("items.produit")
    .populate("id_utilisateur");
  response.send(reservation);
});

router.get("/", async (request, response) => {
  const reservation = await Reservation.find({ supprime: false })
    .sort({
      cree_le: -1,
    })
    .populate("items.produit")
    .populate("id_utilisateur");
  response.send(reservation);
});

router.post("/", async (request, response) => {
  const { montantTotal, id_utilisateur, items } = request.body;
  const reservation = new Reservation({
    montantTotal,
    id_utilisateur,
    items,
  });
  Promise.all(
    items.map(async (item) => {
      const reservations = await Reservation.find({
        "items.produit": item.produit._id,
        etat: "accepté",
      });
      const chevauchements = reservations.filter((r) => {
        return (
          dayjs(item.date_debut).isBetween(r.date_debut, r.date_fin) ||
          dayjs(item.date_fin).isBetween(r.date_debut, r.date_fin) ||
          dayjs(r.date_debut).isBetween(item.date_debut, item.date_fin) ||
          dayjs(r.date_fin).isBetween(item.date_debut, item.date_fin) ||
          dayjs(r.date_debut).format("YYYY-MM-DD") ===
            dayjs(item.date_debut).format("YYYY-MM-DD") ||
          dayjs(r.date_debut).format("YYYY-MM-DD") ===
            dayjs(item.date_fin).format("YYYY-MM-DD") ||
          dayjs(r.date_fin).format("YYYY-MM-DD") ===
            dayjs(item.date_debut).format("YYYY-MM-DD") ||
          dayjs(r.date_fin).format("YYYY-MM-DD") ===
            dayjs(item.date_fin).format("YYYY-MM-DD")
        );
      });
      console.log(chevauchements);
      return chevauchements;
    })
  ).then((data) => {
    console.log(data[0]);
    if (data[0].length === 0) {
      reservation
        .save()
        .then((savedReservation) => {
          response.send(savedReservation);
        })
        .catch((erreur) => {
          console.log(erreur.message);
        });
    } else {
      response.status(500).send("chevauchement");
    }
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

router.get("/getByUser/:id", async (req, res) => {
  const id = req.params.id;
  const reservations = await Reservation.find({
    id_utilisateur: id,
    supprime: false,
  })
    .sort({
      cree_le: -1,
    })
    .populate("items.produit");
  res.send(reservations);
});
module.exports = router;
