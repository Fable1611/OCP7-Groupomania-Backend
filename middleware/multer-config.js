const multer = require("multer");
const path = require("path");

module.exports = (req, res, next) => {
  //Set Storage
  const storage = multer.diskStorage({
    destination: "../images",
    filename: (req, file, callback) => {
      const name = file.originalname.split(" ").join("_");
      callback(null, name + Date.now() + path.extname(file.originalname));
    },
    limits: { fieldSize: 10 * 1024 * 1024 },
  });

  //Init Upload

  const upload = multer({
    storage: storage,
  }).single("IMAGE");

  //Upload Function
  upload(req, res, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log(req.files);
      console.log(req.body);
      next();
    }
  });
};

ARCHIVES;
// //MULTER CONFIGURATION
// const upload = multer({ dest: "uploads/" });
// router.post("/", upload.single("file"), function (req, res, next) {
//   console.log(req.body);
//   console.log(req.file);
//   res.send("request received");
//   // req.file is the `avatar` file
//   // req.body will hold the text fields, if there were any
// });

//Set Storage
const storage = multer.diskStorage({
  destination: "../images",
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    callback(null, name + Date.now() + path.extname(file.originalname));
  },
});

//Init Upload
const upload = multer({
  storage: storage,
}).single("IMAGE");

//Upload Function
