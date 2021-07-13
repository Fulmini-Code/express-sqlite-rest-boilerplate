const jwt = require("jsonwebtoken");
const db = require("../database");

function verifyToken(req, res, next) {
  const bearerHeader = req.headers[process.env.TOKEN_HEADER_KEY];

  if (typeof bearerHeader !== "undefined") {
    try {
      const bearerToken = bearerHeader.split(" ")[1];
      const verified = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY);

      if (verified) {
        const userId = verified.userId;
        db("users")
          .select()
          .where("id", "=", userId)
          .then(() => next())
          .catch((error) => res.status(400).json({ error: error.message }))
      } else {
        // Access Denied
        res.status(401).send(error);
      }
    } catch (error) {
      res.status(401).send(error);
    }
  } else {
    res.status(403).send("no token");
  }
}

module.exports = { verifyToken };
