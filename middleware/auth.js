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
        const sql = "SELECT * FROM users where id = ?";
        let params = [userId];
        db.get(sql, params, (error, row) => {
          if (error) {
            res.status(401).json({ error: error.message });
            return;
          }
          next();
        });
      } else {
        // Access Denied
        res.status(401).send(error);
      }
    } catch (error) {
        res.status(401).send(error);
    }
  } else {
    res.status(403).send('no token');
  }
}

module.exports = { verifyToken };
