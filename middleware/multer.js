//Middleware de configuration du Multer qui permet de gérer les images et les fichiers qui sont envoyés.
const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

//Destination du fichier configurée
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  //Nom du fichier configuré
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("IMAGE");
