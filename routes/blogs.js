const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

//Appel des MiddleWare et des Controllers

const blogsCtrl = require("../controllers/blogs");
const multerConfiguration = require("../middleware/multer");
const auth = require("../middleware/auth");

router.post("/", auth, multerConfiguration, blogsCtrl.createBlog);
router.put("/:id", auth, multerConfiguration, blogsCtrl.modifyOneBlog);
router.post("/like", auth, blogsCtrl.likeBlog);

router.get("/", auth, blogsCtrl.getAllBlogs);
router.get("/:id", auth, blogsCtrl.getOneBlog);
router.delete("/:id", auth, blogsCtrl.deleteOneBlog);

module.exports = router;
