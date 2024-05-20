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
      const produit = await Produit.findById(item.produit._id);
      const chevauchements = await Reservation.find({
        "items.produit": { $in: items.map((item) => item.produit) },
        $or: [
          {
            $and: [
              { "items.date_debut": { $lte: item.date_debut } },
              { "items.date_fin": { $gte: item.date_debut } },
            ],
          },
          {
            $and: [
              { "items.date_debut": { $lte: item.date_fin } },
              { "items.date_fin": { $gte: item.date_fin } },
            ],
          },
          {
            $and: [
              { "items.date_debut": { $gte: item.date_debut } },
              { "items.date_fin": { $lte: item.date_fin } },
            ],
          },
        ],
        etat: "accepté",
      });
      console.log({
        plafond: produit.qte,
        chevauchements: chevauchements.length,
        qte: item.qte,
        id: item.produit._id,
      });
      return produit.qte * 1 - (item.qte * 1 + chevauchements.length * 1) < 0;
    })
  ).then((data) => {
    if (data.includes(true)) {
      response.status(500).send("chevauchement");
    } else {
      reservation
        .save()
        .then((savedReservation) => {
          response.send(savedReservation);
        })
        .catch((erreur) => {
          console.log(erreur.message);
        });
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
