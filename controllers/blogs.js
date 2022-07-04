const Blog = require("../models/Blog");
const fs = require("fs");
const Formdata = require("form-data");
const jwt = require("jsonwebtoken");

// ---------------------------------------Create One Blog---------------------------------- //

exports.createBlog = (req, res, next) => {
  //Vérification s'il y a un fichier ou non, puis création d'un objet en récupérant les éléments de la requête pour les envoyer par la suite à la BDD.
  if (req.file) {
    const blog = new Blog({
      title: req.body.title,
      userId: req.body.userId,
      body: req.body.body,
      author: req.body.author,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,

      likes: 0,
      usersLiked: [],
    });

    blog
      .save()
      .then(() => res.status(201).json({ message: "Objet Enregistre !" }))
      .catch(() => res.status(400).json({ message: "Error !" }));
    console.log(blog);
  } else {
    const blog = new Blog({
      title: req.body.title,
      userId: req.body.userId,
      body: req.body.body,
      author: req.body.author,
      likes: 0,
      usersLiked: [],
    });

    blog
      .save()
      .then(() => res.status(201).json({ message: "Objet Enregistre !" }))
      .catch(() => res.status(400).json({ message: "Error !" }));
    console.log(blog);
  }
};

// ---------------------------------------Modify One Blog---------------------------------- //

exports.modifyOneBlog = (req, res, next) => {
  //Récupération des éléments de la requête (role et userID)
  const reqID = req.body.id;
  const userRole = req.body.userRole;
  console.log(userRole);

  //Récupération du Blog qu'on veut modifier dans la BDD
  Blog.findOne({ _id: reqID }).then((blog) => {
    blogUserId = blog.userId;

    //En fonction du Role (1945 =admin) et si le UserId de la req matche avec le UserId de celui qui a créé le blog, on permet la modification du Blog
    if (userRole == 1945 || blogUserId === req.body.userId) {
      //s'il y a un fichier, on va supprimer l'ancien fichier, et le remplacer par le nouveau, puis sauvegarder l'object blog dans la BDD
      if (req.file) {
        Blog.findOne({ _id: reqID }).then((blog) => {
          //vérification si le blog existant avait déjà une image ou non
          if (blog.imageUrl) {
            const oldfilename = blog.imageUrl.split("/images/")[1];
            console.log(blog.imageUrl);
            console.log(oldfilename);
            fs.unlink(`images/${oldfilename}`, () => {
              Blog.updateOne(
                { _id: reqID },
                {
                  body: req.body.body,
                  title: req.body.title,
                  author: req.body.author,
                  imageUrl: `${req.protocol}://${req.get("host")}/images/${
                    req.file.filename
                  }`,
                }
              )
                .then(() => {
                  res.status(200).json({ message: "Objet modifié !" });
                })
                .catch((error) => res.status(400).json({ error }));
            });
          } else {
            Blog.updateOne(
              { _id: reqID },
              {
                body: req.body.body,
                title: req.body.title,
                author: req.body.author,
                imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
                }`,
              }
            )
              .then(() => {
                res.status(200).json({ message: "Objet modifié !" });
              })
              .catch((error) => res.status(400).json({ error }));
          }
        });
      } else {
        console.log("Pas de fichier, updating body");
        Blog.updateOne(
          { _id: reqID },
          {
            body: req.body.body,
            title: req.body.title,
            author: req.body.author,
          }
        )
          .then(() => {
            res.status(200).json({ message: "Objet modifié !" });
          })
          .catch((error) => res.status(400).json({ error }));
      }
    } else {
      res.status(401).json({ error: "requete non authentifie!" });
    }
  });
};

// ---------------------------------------Get All Blogs---------------------------------- //

exports.getAllBlogs = (req, res, next) => {
  Blog.find()
    .sort({ _id: -1 })
    .then((blogs) => res.status(200).json(blogs))
    .catch((blogs) => res.status(400).json({ error }));
};

// ---------------------------------------Get One Blog---------------------------------- //

exports.getOneBlog = (req, res, next) => {
  Blog.findOne({ _id: req.params.id })
    .then((blog) => res.status(200).json(blog))
    .catch((error) => res.status(400).json("objet non trouve"));
};

// ---------------------------------------Delete Blog---------------------------------- //

exports.deleteOneBlog = (req, res, next) => {
  //Récupération et stockage des données de l'utilisateur contenues dans les headers de la req
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const reqID = decodedToken.UserInfo.userId;
  const userRole = decodedToken.UserInfo.role;

  console.log(reqID, userRole);

  Blog.findOne({ _id: req.params.id }).then((blog) => {
    blogUserId = blog.userId;

    //Protection pour s'assurer que le role ou le ID matche et permet de delete le blog de façon sécuritaire. Ces éléments sont aussi protégés dans le Frontend
    if (userRole == 1945 || blogUserId === reqID) {
      //s'il y a un fichier, on va supprimer l'ancien fichier, et le remplacer par le nouveau, puis sauvegarder l'object blog dans la BDD
      if (req.file) {
        Blog.findOne({ _id: req.params.id })
          .then((blog) => {
            const filename = blog.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
              Blog.deleteOne({ _id: req.params.id })
                .then(() =>
                  res.status(200).json({ message: "Objet supprimé !" })
                )
                .catch((error) => res.status(400).json({ error }));
            });
          })
          .catch((error) => res.status(500).json({ error }));
      } else {
        Blog.findOne({ _id: req.params.id })
          .then((blog) => {
            Blog.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: "Objet supprimé !" }))
              .catch((error) => res.status(400).json({ error }));
          })
          .catch((error) => res.status(500).json({ error }));
      }
    }
  });
};

// ---------------------------------------Like + Dislike---------------------------------- //

exports.likeBlog = (req, res, next) => {
  //Stockage des données de la REQ dans des variables
  let likeValue = req.body.likeValue;
  let blogId = req.body.blogId;
  let userIdReq = req.body.userId;

  console.log(likeValue, blogId, userIdReq);

  //récupération du blog demandé et stockage des données concernant les likes en local
  Blog.findOne({ _id: blogId })
    .then((blog) => {
      likesTable = blog.userLiked;
      console.log(likesTable);

      //en fonction de LikeValue, on demande de rajouter ou d'enlever un like. On va vérifier à chaque fois quel est le statut, et agir en conséquence en rajoutant ou enlevant un like et la mention de l'utilisateur dans le tableau
      if (likeValue === 1) {
        if (!likesTable.includes(userIdReq)) {
          console.log("User did not vote..");
          Blog.updateOne(
            { _id: blogId },
            { $inc: { likes: 1 }, $push: { userLiked: userIdReq } }
          )
            .then(() => res.status(200).json({ message: "Like Enregistré!" }))
            .catch((error) => res.status(400).json({ error }));
        } else {
          console.log("cet utilisateur a deja vote");
          res.status(400).json({
            message: "Cet utilisateur a deja like, pas de changement",
          });
        }
      }

      if (likeValue === 0) {
        if (likesTable.includes(userIdReq)) {
          console.log("User already voted");
          Blog.updateOne(
            { _id: blogId },
            { $inc: { likes: -1 }, $pull: { userLiked: userIdReq } }
          )
            .then(() => res.status(200).json({ message: "Like Retired!" }))
            .catch((error) => res.status(400).json({ error }));
        } else {
          console.log("User did not vote");
          res.status(400).json({
            message: "Cet utilisateur doit liker pour pouvoir enlever un like",
          });
        }
      }
    })
    .catch((error) => res.status(400).json({ error }));
};
