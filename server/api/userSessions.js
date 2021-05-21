const router = require('express').Router()
const UserSession = require('../db/models/userSession');
const { models: { Session, User }} = require('../db')
module.exports = router

router.put('/arrive/:userId/:sessionId', async (req, res, next) => {
  try {
    const usersession = await UserSession.findOne({
        where: {
            userId: req.params.userId,
            sessionId: req.params.sessionId
        }
    });
    const session = await Session.findByPk(req.params.sessionId);
    await usersession.update({arrived: true, currentLat: session.lat, currentLng: session.lng})
    res.send(usersession);
  } catch (err) {
    next(err)
  }
})

router.put('/:userId/:sessionId', async (req, res, next) => {
    try {
      const usersession = await UserSession.findOne({
          where: {
              userId: req.params.userId,
              sessionId: req.params.sessionId
          }
      });
      res.send(await usersession.update(req.body));
    } catch (err) {
      next(err)
    }
  })

  router.get('/:sessionId', async (req, res, next) => {
    try {
      const sessionUsers = await UserSession.findAll({
          where: {
              sessionId: req.params.sessionId
          }
      });
      res.send(sessionUsers);
    } catch (err) {
      next(err)
    }
  })

