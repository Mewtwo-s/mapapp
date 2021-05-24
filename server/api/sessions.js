const router = require('express').Router();
const {
  models: { Session, User, userSession },
} = require('../db');
module.exports = router;

router.get('/allSessions/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId);
    let allSessions = await user.getSessions();
    allSessions = await Promise.all(allSessions.map(async (session) => {
      const hostId = session.hostId;
      const host = await User.findByPk(hostId, {
        attributes: ['firstName', 'lastName', 'id']
      });
      return {
        ...session.dataValues,
        host: host.dataValues
      };
    }))
    res.send(
      allSessions
    );
  } catch (err) {
    next(err);
  }
});
//we should change this to ID
router.get('/:sessionCode', async (req, res, next) => {
  try {
    const session = await Session.findOne({
      where: {
        code: req.params.sessionCode,
      },
      include: {
        model: User,
        attributes: ['id', 'firstName', 'photo'],
      },
    });
    res.send(session);
  } catch (err) {
    next(err);
  }
});

router.put('/:sessionId', async (req, res, next) => {
  try {
    const session = await Session.findOne({
      where: {
        id: req.params.sessionId
      }, 
      include: {
        model: User, 
        attributes: ['id', 'firstName', 'photo']
      }


    });
    res.send(await session.update(req.body));
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    console.log('in post route--', req.body.travelMode)
    const user = await User.findByPk(req.body.hostId);
    const session = await Session.create(req.body);
    await user.addHost(session);
    await session.addUsers(user);
    // const userSession = await userSession.findOne({
    //   where: {
    //     userId: req.body.hostId,
    //     sessionId: session.id
    //   }
    // })
    // userSession.update({accepted: true});
    res.status(201).send(session);
  } catch (err) {
    next(err);
  }
});
