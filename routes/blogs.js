const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const blogsCtrl = require("../controllers/blogs");

router.post("/", blogsCtrl.createBlog);
router.get("/", blogsCtrl.getAllBlogs);
router.get("/:id", blogsCtrl.getOneBlog);
router.delete("/:id", blogsCtrl.deleteOneBlog);

module.exports = router;
