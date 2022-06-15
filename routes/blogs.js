const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

//Appel des MiddleWare et des Controllers

const blogsCtrl = require("../controllers/blogs");
const multerConfiguration = require("../middleware/multer");
const auth = require("../middleware/auth");

router.post("/", multerConfiguration, blogsCtrl.createBlog);
router.put("/:id", multerConfiguration, blogsCtrl.modifyOneBlog);

router.get("/", blogsCtrl.getAllBlogs);
router.get("/:id", blogsCtrl.getOneBlog);
router.delete("/:id", blogsCtrl.deleteOneBlog);

module.exports = router;
