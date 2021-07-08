const db = require("../database");

const mapTableSeed = {
  posts: {
    data: require("./mock_data_posts.json"),
    insertSQL: "INSERT INTO posts (title, body, author) VALUES (?,?,?);",
  },
};

const seedTable = (seedCollection, tableName) => {
  db.run(`DELETE FROM ${tableName};`, (err) => {
    if (err) return console.error(err.message);
  });

  const resetSQL = `update sqlite_sequence set seq=0 where name=\'${tableName}\';`;
  console.log(resetSQL);
  db.run(resetSQL, (err) => {
    if (err) return console.error(err.message);
  });

  const seed = seedCollection.data;
  const sqlInsert = seedCollection.insertSQL;

  for (let i = 0; i < seed.length; i++) {
    db.run(sqlInsert, Object.values(seed[i]), (err) => {
      if (err) return console.error(err.message);

      console.log("Data inserted successfully");
    });
  }
};

for (const tableName in mapTableSeed) {
  seedTable(mapTableSeed[tableName], tableName);
}
