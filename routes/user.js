const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router()

const db = require('../database')

const { verifyToken } = require('../middleware/auth')

const saltRounds = 10

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

router.get('/', async (req, res) => {
  try {
    const rez = await db('users').select('id', 'username', 'email', 'isAdmin')
    res.json({
      message: 'success',
      data: rez,
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
    return
  }
})

router.get('/:id', async (req, res) => {
  try {
    const rez = await db('users')
      .select('id', 'username', 'email', 'isAdmin')
      .where('id', '=', req.params.id)
    res.json({
      message: 'success',
      data: rez,
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
    return
  }
})

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(saltRounds)
  const hashed = await bcrypt.hash(password, salt)
  return hashed
}

router.post('/', async (req, res, next) => {
  var errors = []

  if (!req.body.username) {
    errors.push('No username specified')
  }

  if (!req.body.email) {
    errors.push('No email specified')
  }

  if (!req.body.password) {
    errors.push('No password specified')
  }

  const { password, confirmPassword } = req.body

  if (password && password !== confirmPassword) {
    errors.push('Passwords do not match')
  }

  if (errors.length) {
    res.status(400).json({ error: errors.join(', ') })
    return
  }

  let data = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  }

  const dataInsert = {
    username: data['username'],
    email: data['email'],
    password: await hashPassword(data['password']),
    isAdmin: false,
    isActive: true,
  }

  try {
    const rez = await db('users').insert(dataInsert)
    res.json({
      message: 'success',
      data: rez,
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
    return
  }
})

router.put('/:id', [verifyToken], async (req, res, next) => {
  if (!req.body.email) {
    errors.push('No email specified')
  }

  let data = {
    email: req.body.email,
    isActive: req.body.isActive,
    isAdmin: req.body.isAdmin,
  }

  try {
    const rez = await db('users').where('id', '=', req.params.id).update(data)
    res.json({
      message: 'success',
      data: rez,
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
    return
  }
})

router.delete('/:id', [verifyToken], async (req, res, next) => {
  try {
    const rez = await db('users').where('id', '=', req.params.id).del()
    res.json({
      message: 'success',
      data: rez,
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
    return
  }
})

module.exports = router
