const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

const db = require("../database");

router.post("/generate_token", async (req, res, next) => {
  var errors = [];

  if (!req.body.username) {
    errors.push("No username specified");
  }

  if (!req.body.password) {
    errors.push("No password specified");
  }

  if (errors.length) {
    res.status(400).json({ error: errors.join(", ") });
    return;
  }

  const data = {
    username: req.body.username,
    password: req.body.password,
  };

  try {
    const rez = await db("users").select().where("username", data.username);

    if (rez.length === 0) {
      res.status(400).json({ error: "Wrong credentials" });
      return;
    }

    const match = bcrypt.compareSync(data.password, rez[0]["password"]);
    if (!match) {
      res.status(400).json({ error: "Wrong credentials" });
      return;
    }
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ userId: rez[0]["id"] }, jwtSecretKey, {
      expiresIn: "1h",
    });
    res.json({
      message: "success",
      token: token,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  db.destroy();
});

router.get("/", async (req, res) => {
  try {
    const rez = await db("users").select();
    res.json({
      message: "success",
      data: rez,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  db.destroy();
});

router.get("/:id", async (req, res) => {
  try {
    const rez = await db("users").select().where("id", "=", req.params.id);
    res.json({
      message: "success",
      data: rez,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  db.destroy();
});

// router.post("/", (req, res, next) => {
//   var errors = [];

//   if (!req.body.title) {
//     errors.push("No title specified");
//   }

//   if (!req.body.author) {
//     errors.push("No author specified");
//   }

//   if (errors.length) {
//     res.status(400).json({ error: errors.join(", ") });
//     return;
//   }

//   let data = {
//     title: req.body.title,
//     body: req.body.body,
//     author: req.body.author,
//   };

//   const sql = "INSERT INTO posts (title, body, author) VALUES (?,?,?);";
//   const params = [data.title, data.body, data.author];
//   db.run(sql, params, function (err, result) {
//     if (err) {
//       res.status(400).json({ error: err.message });
//       return;
//     }
//     res.json({
//       message: "success",
//       data: data,
//       id: this.lastID,
//     });
//   });
// });

// router.put("/:id", (req, res, next) => {
//   let data = {
//     title: req.body.title,
//     body: req.body.body,
//     author: req.body.author,
//   };

//   const sql = `UPDATE posts SET
//                       title = COALESCE(?,title),
//                       body = COALESCE(?,body),
//                       author = COALESCE(?,author)
//                       where id = ?;`;
//   const params = [data.title, data.body, data.author, req.params.id];

//   db.run(sql, params, function (err, result) {
//     if (err) {
//       res.status(400).json({ error: err.message });
//       return;
//     }
//     res.json({
//       message: "success",
//       data: data,
//       changes: this.changes,
//     });
//   });
// });

router.delete("/:id", async (req, res, next) => {
  try {
    const rez = await db("users").where("id", "=", req.params.id).del();
    res.json({
      message: "success",
      data: rez,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
  db.destroy();
});

module.exports = router;
