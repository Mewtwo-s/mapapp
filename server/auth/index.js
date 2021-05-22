const router = require('express').Router()
const { models: {User }} = require('../db')
module.exports = router

router.post('/login', async (req, res, next) => {
  try {
    res.send({ token: await User.authenticate(req.body)}); 
  } catch (err) {
    next(err)
  }
})


router.post('/signup', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.send({token: await user.generateToken()})
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.post('/accept', async (req, res, next) => {
  try {
    const user = await User.findOne(
      {
        where: {
          confirmationCode: req.body.confirmationCode
      }
    })
    await user.update(req.body);
    res.send({token: await user.generateToken()})
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.get('/me', async (req, res, next) => {
  try {
    const user = await User.findByToken(req.headers.authorization)
    //get all sessions belongs to users
    const allSessions = await user.getSessions()
    //console.log('allSessions', allSessions.map(session => session.dataValues))
    res.send({
      ...user.dataValues,
      allSessions: allSessions.map(session => session.dataValues)
    })
  } catch (err) {
    next(err)
  }
})
