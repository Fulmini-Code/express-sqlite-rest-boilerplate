// Update with your config settings.
const path = require("path");

const DBSOURCE = "db.sqlite";
const dbName = path.join(__dirname, "data", DBSOURCE);

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: dbName,
    },
    seeds: {
      directory: './seed/dev'
  }
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};
