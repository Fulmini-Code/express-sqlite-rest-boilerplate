const dotenv = require('dotenv')
const express = require('express')

const db = require('./database')

dotenv.config()


const port = process.env.PORT

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.listen(port, () => {
    console.log(`Server started @ http://localhost:${port}/`)
})

app.get("/", (req, res) => {
    res.send("Hello world!!!")
})

app.get('/posts', (req, res) => {
    const sql = "SELECT * FROM posts"
    let params = []
    db.all(sql, params, (error, rows) => {
        if (error) {
            res.status(400).json({ "error": error.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    })
})

app.get('/posts/:id', (req, res) => {
    const sql = "SELECT * FROM posts where id = ?"
    let params = [req.params.id]
    db.get(sql, params, (error, row) => {
        if (error) {
            res.status(400).json({ "error": error.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    })
})

app.post('/posts/', (req, res, next) => {
    var errors = []

    if (!req.body.title) {
        errors.push("No title specified");
    }

    if (!req.body.author) {
        errors.push("No author specified");
    }

    if (errors.length) {
        res.status(400).json({ "error": errors.join(', ') })
        return
    }

    let data = {
        title: req.body.title,
        body: req.body.body,
        author: req.body.author,
    }

    const sql = 'INSERT INTO posts (title, body, author) VALUES (?,?,?);'
    const params = [data.title, data.body, data.author]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message })
            return
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID,
        })
    })
})

app.put('/posts/:id', (req, res, next) => {
    let data = {
        title: req.body.title,
        body: req.body.body,
        author: req.body.author,
    }

    const sql = `UPDATE posts SET 
                    title = COALESCE(?,title), 
                    body = COALESCE(?,body), 
                    author = COALESCE(?,author) 
                    where id = ?;`
    const params = [data.title, data.body, data.author, req.params.id]

    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message })
            return
        }
        res.json({
            "message": "success",
            "data": data,
            "changes": this.changes
        })
    })
})

app.delete('/posts/:id', (req, res, next) => {
    const sql = `DELETE FROM posts WHERE id = ?`
    const params = [req.params.id]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message })
            return
        }
        res.json({
            "message": "deleted",
            "changes": this.changes
        })
    })
})

app.use((req, res) => {
    res.status(404);
})