const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  userId: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: String, required: true },
  imageUrl: { type: String, required: false },
  alt: { type: String, required: true },
  userLiked: [{ type: String, required: true }],
  likes: { type: Number, required: true },
});

module.exports = mongoose.model("Blog", blogSchema);
