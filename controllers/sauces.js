const Sauce = require("../models/Sauce");
const fs = require("fs");
const { updateOne } = require("../models/Sauce");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  sauceObject.likes = 0;
  sauceObject.dislikes = 0;
  sauceObject.usersLiked = [];
  sauceObject.usersDisliked = [];

  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet Enregistre !" }))
    .catch(() => res.status(400).json({ message: "Error !" }));
  console.log(sauce);
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json("objet non trouve"));
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const sauceObject = req.file
      ? {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };

    console.log(req.body.userId);
    console.log(sauce.userId);

    if (req.body.userId !== sauce.userId) {
      console.log("vous ne pouvez pas modifier cette sauce");
      res.status(403).json({ message: " 403: unauthorized request. " });
    } else if (req.body.userId === sauce.userId) {
      Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
      )
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => res.status(400).json({ error }));
    }
  });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// ---------------------------------------Like + Dislike---------------------------------- //

exports.likeDislikeSauce = (req, res, next) => {
  //Fonctions et Variables
  let likeValue = req.body.like;
  let sauceId = req.params.id;
  let userIdReq = req.body.userId;

  // LIKE +1 ou -1
  if (likeValue === 1) {
    Sauce.findOneAndUpdate(
      { _id: sauceId },
      { $inc: { likes: 1 }, $push: { usersLiked: userIdReq } }
    )
      .then(() => res.status(200).json({ message: "Like Enregistré!" }))
      .catch((error) => res.status(400).json({ error }));
  } else if (likeValue === -1) {
    Sauce.findOneAndUpdate(
      { _id: sauceId },
      { $inc: { dislikes: 1 }, $push: { usersDisliked: userIdReq } }
    )
      .then(() => res.status(200).json({ message: "Like Enregistré!" }))
      .catch((error) => res.status(400).json({ error }));
  } else if (likeValue === 0) {
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
        likesTable = sauce.usersLiked;
        dislikesTable = sauce.usersDisliked;
        console.log(likesTable);

        if (likesTable.includes(userIdReq)) {
          console.log("cet utilisateur a deja vote");

          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersLiked: userIdReq }, $inc: { likes: -1 } }
          )
            .then(() => res.status(200).json({ message: "Like Mis a jour!" }))
            .catch((error) => res.status(400).json({ error }));
        } else if (dislikesTable.includes(userIdReq)) {
          console.log("cet utilisateur a deja vote");

          Sauce.updateOne(
            { _id: sauceId },
            { $pull: { usersDisliked: userIdReq }, $inc: { likes: -1 } }
          )
            .then(() =>
              res.status(200).json({ message: "Dislike Mis a jour!" })
            )
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};
