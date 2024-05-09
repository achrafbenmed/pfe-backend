const express = require("express");
const Produit = require("../models/Produit");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });
const router = express.Router();

router.get("/getAll", async (request, response) => {
  const produits = await Produit.find()
    .sort({
      cree_le: -1,
    })
    .populate("idCategorie");
  response.send(produits);
});

router.get("/", async (request, response) => {
  const produits = await Produit.find({ supprime: false })
    .sort({
      cree_le: -1,
    })
    .populate("idCategorie");
  response.send(produits);
});

router.post("/", upload.single("image"), (request, response) => {
  const { nom, prix, qte, taille, idCategorie } = request.body;
  const produit = new Produit({
    nom,
    prix,
    qte,
    taille,
    idCategorie,
    image: request.file.filename,
  });
  produit
    .save()
    .then((savedProduit) => {
      response.send(savedProduit);
    })
    .catch((erreur) => {
      console.log(erreur.message);
    });
});

router.put("/:id", upload.single("image"), async (request, response) => {
  try {
    const { nom, prix, qte, taille, idCategorie } = request.body;
    const id = request.params.id;

    const produit = await Produit.findById(id);
    if (produit) {
      Object.assign(produit, {
        nom: nom ? nom : produit.nom,
        prix: prix ? prix : produit.prix,
        qte: qte ? qte : produit.qte,
        taille: taille ? taille : produit.taille,
        idCategorie: idCategorie ? idCategorie : produit.idCategorie,
        image: request.file ? request.file.filename : produit.image,
      });
      produit
        .save()
        .then((savedProduit) => {
          response.send(savedProduit);
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
    const produit = await Produit.findById(id);
    if (produit) {
      produit.supprime = true;
      produit
        .save()
        .then((savedProduit) => {
          response.send(savedProduit);
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
    const produit = await Produit.findById(id);
    if (produit) {
      produit.supprime = false;
      produit
        .save()
        .then((savedProduit) => {
          response.send(savedProduit);
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
