const db = require("../database");
const bcrypt = require("bcrypt");

const saltRounds = 10;

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}

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

  const dataInsert = {
    username: params["username"],
    email: params["email"],
    password: params["password"]
      ? await hashPassword(params["password"])
      : await hashPassword("12345"),
    isAdmin: params["isAdmin"],
    isActive: true,
  };

  const rez = await db("users").insert(dataInsert);

  console.log(rez);

  await db.destroy()
};

createUser();
