const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const roles = require("../config/roles_list");
const { findOneAndUpdate } = require("../models/User");
const dotenv = require("dotenv").config();

const User = require("../models/User");

exports.signup = (req, res, next) => {
  console.log(roles.User);
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

exports.login = (req, res, next) => {
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
            //CREATING JWTS
            const accessToken = jwt.sign(
              { UserInfo: { userId: user._id, roles: user.role } },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "1d",
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

exports.authStatus = (req, res, next) => {
  try {
    const decodedToken = jwt.verify(
      req.body.token,
      process.env.ACCESS_TOKEN_SECRET
    );
    const userId = decodedToken;
    console.log(decodedToken);

    if (req.body.userId && req.body.userId !== userId) {
      throw "user Id non valable !";
    } else {
      console.log(req.body.token);
      res.status(200).json(decodedToken.UserInfo);
    }
  } catch (error) {
    res.status(401).json({ error: error | "requete non authentifie!" });
  }
};
