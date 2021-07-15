const express = require("express");
const router = express.Router();      //Routes manager

const db = require("../database");

const { verifyToken } = require("../middleware/auth");

// Returns all the posts from the database
router.get("/", [verifyToken], async (req, res) => {
  try {
    const rez = await db("posts").select();
    res.json({
      message: "success",
      data: rez,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
});

// Returns a post with the given id
router.get("/:id", [verifyToken], async (req, res) => {
  try {
    const rez = await db("posts").select().where("id", "=", req.params.id);
    res.json({
      message: "success",
      data: rez,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
});

// Add a new post in the database
router.post("/", [verifyToken], async (req, res, next) => {
  var errors = [];

  if (!req.body.title) {
    errors.push("No title specified");
  }

  if (!req.body.author) {
    errors.push("No author specified");
  }

  if (errors.length) {
    res.status(400).json({ error: errors.join(", ") });
    return;
  }

  let data = {
    title: req.body.title,
    body: req.body.body,
    author: req.body.author,
  };

  try {
    const rez = await db("posts").insert(data);
    res.json({
      message: "success",
      data: rez,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
});

// Edit a post with the given id
router.put("/:id", [verifyToken], async (req, res, next) => {
  let data = {
    title: req.body.title,
    body: req.body.body,
    author: req.body.author,
  };

  try {
    const rez = await db("posts").where("id", "=", req.params.id).update(data);
    res.json({
      message: "success",
      data: rez,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
});

// Delete a post with the given id
router.delete("/:id", [verifyToken], async (req, res, next) => {
  try {
    const rez = await db("posts").where("id", "=", req.params.id).del();
    res.json({
      message: "success",
      data: rez,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
    return;
  }
});

module.exports = router;
