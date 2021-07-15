const dotenv = require('dotenv')
const express = require('express')
const cors = require('cors')

// Local Routes import
const posts = require('./routes/posts')
const users = require('./routes/user')
const auth = require('./routes/auth')

dotenv.config()

const port = process.env.PORT

// Creating new instance for the express backend
const app = express()

// Express app configuration
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// Starting the express app
app.listen(port, () => {
  console.log(`Server started @ http://localhost:${port}/`)
})

// Routes configuration
app.get('/', (req, res) => {
  res.send('Hello world!!!')
})

app.use('/auth', auth)      // Configures the routes from the auth.js file
app.use('/users', users)    // Configures the routes from the user.js file
app.use('/posts', posts)    // Configures the routes from the posts.js file

// Configures the resoponse for an inexistent route
app.use((req, res) => {
  res.status(404)
})
