const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router() //Routes manager

const db = require('../database')
// Generates a token and a refreshtoken for given user
router.post('/generate_token', async (req, res, next) => {
  var errors = []

  if (!req.body.username) {
    errors.push('No username specified')
  }

  if (!req.body.password) {
    errors.push('No password specified')
  }

  if (errors.length) {
    res.status(400).json({ error: errors.join(', ') })
    return
  }

  const data = {
    username: req.body.username,
    password: req.body.password,
  }

  try {
    const rez = await db('users').select().where('username', data.username)

    if (rez.length === 0) {
      res.status(400).json({ error: 'Wrong credentials' })
      return
    }

    const match = bcrypt.compareSync(data.password, rez[0]['password'])
    if (!match) {
      res.status(400).json({ error: 'Wrong credentials' })
      return
    }
    const jwtSecretKey = process.env.JWT_SECRET_KEY
    const token = jwt.sign({ userId: rez[0]['id'] }, jwtSecretKey, {
      expiresIn: '5m',
    })
    const refreshToken = jwt.sign({ userId: rez[0]['id'] }, jwtSecretKey, {
      expiresIn: '2 days',
    })
    res.json({
      message: 'success',
      token: token,
      refreshToken: refreshToken,
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
    return
  }
})
// refreshtoken creates a new token for  given user
router.post('/refresh_token', async (req, res, next) => {
  var errors = []

  if (!req.body.refreshToken) {
    errors.push('No refreshToken specified')
  }

  if (errors.length) {
    res.status(400).json({ error: errors.join(', ') })
    return
  }

  const jwtSecretKey = process.env.JWT_SECRET_KEY
  const verified = jwt.verify(req.body.refreshToken, jwtSecretKey)

  if (verified) {
    const userId = verified.userId
    const token = jwt.sign({ userId: userId }, jwtSecretKey, {
      expiresIn: '5m',
    })
    res.json({
      message: 'success',
      token: token,
    })
  } else {
    res.status(401).send(error)
  }
})

module.exports = router
