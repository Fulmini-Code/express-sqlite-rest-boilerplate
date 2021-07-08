const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

// Routes import
const posts = require("./routes/posts");
const users = require("./routes/user");

dotenv.config();

const port = process.env.PORT;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.listen(port, () => {
  console.log(`Server started @ http://localhost:${port}/`);
});

app.get("/", (req, res) => {
  res.send("Hello world!!!");
});

app.use("/users", users);
app.use("/posts", posts);

app.use((req, res) => {
  res.status(404);
});
