const router = require('express').Router()
const UserSession = require('../db/models/UserSession');
const { models: { Session, User }} = require('../db')
module.exports = router

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
