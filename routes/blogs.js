const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

//Importation des MiddleWare et des Controllers
const blogsCtrl = require("../controllers/blogs");
const multerConfiguration = require("../middleware/multer");
const auth = require("../middleware/auth");

//Routes Post et Put
router.post("/", auth, multerConfiguration, blogsCtrl.createBlog);
router.put("/:id", auth, multerConfiguration, blogsCtrl.modifyOneBlog);
router.post("/like", auth, blogsCtrl.likeBlog);

//Routes Get et Delete
router.get("/", auth, blogsCtrl.getAllBlogs);
router.get("/:id", auth, blogsCtrl.getOneBlog);
router.delete("/:id", auth, blogsCtrl.deleteOneBlog);

module.exports = router;
