const jwt = require("jsonwebtoken");

//Middleware d'authentification qui protège les routes en validant si les tokens sont bons.
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log("Passed Auth Middleware");
    next();
  } catch (error) {
    res.status(401).json({ error: error | "requete non authentifie!" });
  }
};
