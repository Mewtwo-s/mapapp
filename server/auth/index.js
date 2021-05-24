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
    let allSessions = await user.getSessions()
    //find host's name
    allSessions = await Promise.all(allSessions.map(async (session) => {
      const hostId = session.hostId;
      const host = await User.findByPk(hostId, {
        attributes: ['firstName', 'lastName']
      });
      return {
        ...session.dataValues,
        host: host.dataValues
      };
    }))
    //console.log('allsessions', allSessions);
    res.send({
      ...user.dataValues,
      allSessions
    });
  } catch (err) {
    next(err);
  }
})