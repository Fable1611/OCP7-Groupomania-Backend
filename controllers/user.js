const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findOneAndUpdate } = require("../models/User");
const dotenv = require("dotenv").config();

const User = require("../models/User");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 5)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
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
            const roles = 5150;

            //CREATING JWTS
            const accessToken = jwt.sign(
              { UserInfo: { userId: user._id, roles: roles } },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "30s",
              }
            );

            const refreshToken = jwt.sign(
              { UserInfo: { userId: user._id } },
              process.env.REFRESH_TOKEN_SECRET,
              {
                expiresIn: "1d",
              }
            );

            //SAVING REFRESH TOKEN IN DB
            console.log(refreshToken);
            User.updateOne(
              { _id: user._id },
              { $addToSet: { refreshToken: refreshToken } }
            );
            console.log(user.refreshToken);

            res.status(200).json({
              token: accessToken,
            });
          }
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
