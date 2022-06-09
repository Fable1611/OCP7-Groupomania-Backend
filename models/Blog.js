const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  title: { type: String, required: true, unique: true },
  body: { type: String, required: true },
  author: { type: String, required: true },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Blog", blogSchema);
