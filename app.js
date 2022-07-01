const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

const path = require("path");

//Stockage des routes des Blogs et des User
const blogsRoutes = require("./routes/blogs");
const userRoutes = require("./routes/user");

//Connexion à Mongoose, les données sensibles sont stockées dans une variable d'environnement pour plus de sécurité
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Instructions sur l'utilisation des routes pour les images, les users et les blogs
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/blogs", blogsRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
