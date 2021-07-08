const db = require("../database");

const sqlCreateUsersTable = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  isActive TINYINT NOT NULL,
  isAdmin TINYINT NOT NULL
)`;

const sqlCreatePostsTable = `CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(100) NOT NULL,
    body text,
    author VARCHAR(100) NOT NULL
)`;

const sqlTablesMap = {
  users: sqlCreateUsersTable,
  posts: sqlCreatePostsTable,
};

const createTable = (sqlCreate, tableName) => {
  db.run(sqlCreate, (error) => {
    if (error) return console.error(error.message);

    console.log(`Creation of the table ${tableName} successful!`);
  });
};

for (const tableName in sqlTablesMap) {
  createTable(sqlTablesMap[tableName], tableName);
}
