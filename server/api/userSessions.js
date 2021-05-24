const router = require('express').Router()
const UserSession = require('../db/models/userSession');
const { models: { Session, User }} = require('../db');
const userSession = require('../db/models/userSession');
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
      if (usersession) {
        res.send(await usersession.update(req.body));
      }
    } catch (err) {
      next(err)
    }
  })

  // router.get('/:sessionId', async (req, res, next) => {
  //   try {
  //     const sessionUsers = await UserSession.findAll({
  //         where: {
  //             sessionId: req.params.sessionId
  //         }, 
  //         include: {
  //           model: User
  //         }
  //     });
  //     res.send(sessionUsers);
  //   } catch (err) {
  //     next(err)
  //   }
  // })


  router.get('/:sessionId', async (req, res, next) => {
    try {
      const sessionUsers = await User.findAll({
        include: {
          model: Session, 
          where: {
            id: req.params.sessionId
          },
          attributes: ['id']
        }
      });
      res.send(sessionUsers);
    } catch (err) {
      next(err)
    }
  })