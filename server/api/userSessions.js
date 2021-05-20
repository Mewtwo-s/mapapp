const router = require('express').Router()
const userSession = require('../db/models/userSession');
const { models: { Session, User }} = require('../db')
module.exports = router

router.put('/:userId/:sessionId', async (req, res, next) => {
    try {
      const usersession = await userSession.findOne({
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

