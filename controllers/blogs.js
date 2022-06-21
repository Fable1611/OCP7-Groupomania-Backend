const Blog = require("../models/Blog");
const fs = require("fs");
const Formdata = require("form-data");

exports.createBlog = (req, res, next) => {
  if (req.file) {
    const blog = new Blog({
      title: req.body.title,
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
      body: req.body.body,
      author: req.body.author,
      // imageUrl: `${req.protocol}://${req.get("host")}/images/${
      //   req.file.filename
      // }`,

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

exports.modifyOneBlog = (req, res, next) => {
  const reqID = req.body.id;

  if (req.file) {
    Blog.findOne({ _id: reqID }).then((blog) => {
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
    });
  } else {
    console.log("no file here, updating body");
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
};

exports.getAllBlogs = (req, res, next) => {
  Blog.find()
    .sort({ title: -1 })
    .then((blogs) => res.status(200).json(blogs))
    .catch((blogs) => res.status(400).json({ error }));
};

exports.getOneBlog = (req, res, next) => {
  console.log(req.params.id);
  Blog.findOne({ _id: req.params.id })
    .then((blog) => res.status(200).json(blog))
    .catch((error) => res.status(400).json("objet non trouve"));
};

exports.deleteOneBlog = (req, res, next) => {
  if (req.file) {
    Blog.findOne({ _id: req.params.id })
      .then((blog) => {
        const filename = blog.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Blog.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Objet supprimé !" }))
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
};
