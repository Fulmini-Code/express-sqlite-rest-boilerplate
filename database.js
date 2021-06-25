const sqlite3 = require('sqlite3').verbose()
const path = require('path');

const DBSOURCE = "db.sqlite"
const dbName = path.join(__dirname, "data", DBSOURCE)


const db = new sqlite3.Database(dbName, (error) => {
    if (error)
        return console.error(error.message)

    console.log('Connected to the SQLite database!')
})


module.exports = db

