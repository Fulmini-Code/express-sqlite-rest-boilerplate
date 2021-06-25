const db = require('../database')

const sqlCreatePostsTable = `CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(100) NOT NULL,
    body text,
    author VARCHAR(100) NOT NULL
)`

const sqlTablesMap = {
    "posts": sqlCreatePostsTable,
}



const createTable = (sqlCreate, tableName) => {
    db.run(sqlCreate, (error) => {
        if (error)
            return console.error(error.message)

        console.log(`Creation of the table ${tableName} successful!`)

    })
}

for (const tableName in sqlTablesMap) {
    createTable(sqlTablesMap[tableName],tableName);
}