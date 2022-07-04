const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const roles = require("../config/roles_list");
const { findOneAndUpdate } = require("../models/User");

const User = require("../models/User");

// ---------------------------------------Create New User---------------------------------- //
//Utilisation de Bcrypt pour Hasher le password, enregistrement du User par la suite
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 5)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
        role: roles.User,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur Creer !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// ---------------------------------------Login d'un User---------------------------------- //
exports.login = (req, res, next) => {
  //Utilisation de l'email contenu dans la Req pour trouver l'utilisateur
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur Introuvable" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "MDP Incorrect" });
          } else {
            //Création de Token si l'utilisateur est le bon, valable 2h
            const accessToken = jwt.sign(
              { UserInfo: { userId: user._id, role: user.role } },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "2h",
              }
            );

            res.status(200).json({
              token: accessToken,
              role: user.role,
              userId: user._id,
            });
          }
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

// ---------------------------------------Login d'un User---------------------------------- //
//Controller du status d'authentification des User, qui vérifie quand il y a un render de l'application si l'utilisateur est toujours authentifié (2h)
exports.authStatus = (req, res, next) => {
  try {
    const decodedToken = jwt.verify(
      req.body.token,
      process.env.ACCESS_TOKEN_SECRET
    );

    console.log(decodedToken);

    res.status(200).json(decodedToken.UserInfo);
  } catch (error) {
    res.status(401).json({ error: "requete non authentifie!" });
  }
};
