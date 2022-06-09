const Blog = require("../models/Blog");

exports.createBlog = (req, res, next) => {
  const blog = new Blog({
    title: req.body.title,
    body: req.body.body,
    author: req.body.author,
  });

  blog
    .save()
    .then(() => res.status(201).json({ message: "Objet Enregistre !" }))
    .catch(() => res.status(400).json({ message: "Error !" }));
  console.log(blog);
};

exports.getAllBlogs = (req, res, next) => {
  Blog.find()
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
  Blog.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: "Objet supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};
