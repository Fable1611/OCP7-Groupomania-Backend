const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

//importation du middleware password
const password = require("../middleware/password");

router.post("/signup", password, userCtrl.signup);
router.post("/login", userCtrl.login);
router.post("/authstatus", userCtrl.authStatus);

module.exports = router;
