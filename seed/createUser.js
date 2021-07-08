const db = require("../database");
const bcrypt = require("bcrypt");

const saltRounds = 10;

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}

const insertSQL =
  "INSERT INTO users (username, email, password, isAdmin, isActive) VALUES (?,?,?,?,true);";

const createUser = async () => {
  var params = {};

  for (let i = 0; i < process.argv.length; i++) {
    const pair = process.argv[i].split("=");
    try {
      params[pair[0]] = pair[1];
    } catch (error) {
      console.error(error);
    }
  }

  const paramsInsert = [
    params["username"],
    params["email"],
    params["password"]
      ? await hashPassword(params["password"])
      : await hashPassword("12345"),
    params["isAdmin"],
  ];

  db.run(insertSQL, paramsInsert, (err) => {
    if (err) return console.error(err.message);

    console.log("User created successfully");
  });
};

createUser();
