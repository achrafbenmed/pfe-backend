const express = require("express");
const Categorie = require("../models/Categorie");
const router = express.Router();

router.get("/getAll", async (request, response) => {
  const categories = await Categorie.find();
  response.send(categories);
});
router.get("/", async (request, response) => {
  const categories = await Categorie.find({ supprime: false });
  response.send(categories);
});

router.post("/", (request, response) => {
  const { nom } = request.body;
  const categorie = new Categorie({ nom, supprime: false });
  categorie
    .save()
    .then((savedCategorie) => {
      response.send(savedCategorie);
    })
    .catch((erreur) => {
      console.log(erreur.message);
    });
});

router.put("/:id", async (request, response) => {
  try {
    const id = request.params.id;
    const nom = request.body.nom;
    const categorie = await Categorie.findById(id);
    if (categorie) {
      categorie.nom = nom;
      categorie
        .save()
        .then((savedCategorie) => {
          response.send(savedCategorie);
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
    const categorie = await Categorie.findById(id);
    if (categorie) {
      categorie.supprime = true;
      categorie
        .save()
        .then((savedCategorie) => {
          response.send(savedCategorie);
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
    const categorie = await Categorie.findById(id);
    if (categorie) {
      categorie.supprime = false;
      categorie
        .save()
        .then((savedCategorie) => {
          response.send(savedCategorie);
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
