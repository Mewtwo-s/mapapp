const router = require('express').Router()
const UserSession = require('../db/models/userSession');
const { models: { Session, User }} = require('../db');
const userSession = require('../db/models/userSession');
module.exports = router

router.put('/arrive/:userId/:sessionId', async (req, res, next) => {
  try {
    const throughTableRow = await UserSession.findOne({
        where: {
            userId: req.params.userId,
            sessionId: req.params.sessionId
        }
    });
    const session = await Session.findByPk(req.params.sessionId);
    await throughTableRow.update({arrived: true, currentLat: session.lat, currentLng: session.lng})
    const usersession = await User.findOne({
      where: {
        id: req.params.userId
      },
      include: {
        model: Session, 
        where: {
          id: req.params.sessionId
        },
        attributes: ['id']
      }
    });
    res.send(usersession);
  } catch (err) {
    next(err)
  }
})

router.put('/:userId/:sessionId', async (req, res, next) => {
    try {
      const userSessionThroughRow = await UserSession.findOne({
          where: {
              userId: req.params.userId,
              sessionId: req.params.sessionId
          }
      });
      if (userSessionThroughRow) {
        await userSessionThroughRow.update(req.body);
        const usersession = await User.findOne({
          where: {
            id: req.params.userId
          },
          include: {
            model: Session, 
            where: {
              id: req.params.sessionId
            },
            attributes: ['id']
          }
        })
        res.send(usersession);
      }
    } catch (err) {
      next(err)
    }
  })

  router.get('/:userId/:sessionId', async (req, res, next) => {
    try {
      const usersession = await User.findOne({
        where: {
          id: req.params.userId
        },
        include: {
          model: Session, 
          where: {
            id: req.params.sessionId
          },
          attributes: ['id']
        }
      });
      if (usersession) {
        res.send(usersession);
      }
    } catch (err) {
      next(err)
    }
  })


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

