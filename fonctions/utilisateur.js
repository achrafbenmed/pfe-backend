const express = require("express");
const bcrypt = require("bcrypt");
const Utilisateur = require("../models/Utilisateur");

const router = express.Router();
router.get("/getAll", async (request, response) => {
  const utilisateur = await Utilisateur.find();
  response.send(utilisateur);
});

router.get("/", async (request, response) => {
  const utilisateur = await Utilisateur.find({ supprime: false });
  response.send(utilisateur);
});

router.post("/", (request, response) => {
  const crypte = bcrypt.hashSync(request.body.mdp, 10);
  const utilisateur = new Utilisateur({
    nom: request.body.nom,
    prenom: request.body.prenom,
    cin: request.body.cin,
    email: request.body.email,
    mdp: crypte,
    role: request.body.role,
    tel: request.body.tel,
    date_naissance: request.body.date_naissance,
    sexe: request.body.sexe,
    supprime: false,
  });
  utilisateur
    .save()
    .then((savedUtilisateur) => {
      response.send(savedUtilisateur);
    })
    .catch((erreur) => {
      response.status(500).send(erreur.message);
    });
});

router.put("/:id", async (request, response) => {
  try {
    const { nom, prenom, cin, email, mdp, role, tel, date_naissance, sexe } =
      request.body;
    const id = request.params.id;
    const utilisateur = await Utilisateur.findById(id);
    if (utilisateur) {
      utilisateur.nom = nom;
      utilisateur.prenom = prenom;
      utilisateur.cin = cin;
      utilisateur.email = email;
      utilisateur.mdp = mdp;
      utilisateur.role = role;
      utilisateur.tel = tel;
      utilisateur.date_naissance = date_naissance;
      utilisateur.sexe = sexe;
      utilisateur
        .save()
        .then((savedUtilisateur) => {
          response.send(savedUtilisateur);
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
    const utilisateur = await Utilisateur.findById(id);
    if (utilisateur) {
      utilisateur.supprime = true;
      utilisateur
        .save()
        .then((savedutilisateur) => {
          response.send(savedutilisateur);
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
    const utilisateur = await Utilisateur.findById(id);
    if (utilisateur) {
      utilisateur.supprime = false;
      utilisateur
        .save()
        .then((savedutilisateur) => {
          response.send(savedutilisateur);
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

router.post("/connecter", async (request, response) => {
  const { email, mdp } = request.body;
  const utilisateur = await Utilisateur.findOne({ email });
  if (utilisateur) {
    if (bcrypt.compareSync(mdp, utilisateur.mdp)) {
      if (utilisateur.supprime) {
        response.status(402).send("votre compte a été supprimé");
      } else {
        response.send(utilisateur);
      }
    } else {
      response.status(403).send("mot de passe incorrecte");
    }
  } else {
    response.status(404).send("email incorrecte");
  }
});
module.exports = router;
