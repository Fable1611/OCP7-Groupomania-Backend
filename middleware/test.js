const Formdata = require("form-data");
const fs = require("fs");

module.exports = (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  next();
};
