const router = require('express').Router()
const { models: { User, Session, UserSession }} = require('../db')
const runMailer = require('../../nodemailer');
module.exports = router;


router.get('/test', async (req, res, next) => {
  try {
    res.send(await User.findAll({
      where:{id:1}, 
      include:UserSession})
)
  } catch (err) {
    next(err)
  }
})

router.get('/', async (req, res, next) => {
  try {

    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

router.put('/:confirmationCode', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        confirmationCode: req.params.confirmationCode
      }
    });
    res.send(user.update({accepted: true}))
  } catch (err) {
      next(err)
    }
  })

router.get('/friends/:userId', async (req, res, next) => {
  try {
    let friends = []
    let relatedSessions = null
    const result = await User.findOne({where: { id: req.params.userId}, include: Session})
    relatedSessions = result.sessions
    relatedSessions.forEach(async(session) =>{
    let sessionId = session.id
    let sessionUser = await Session.findOne({
        where:{id:sessionId}, 
        include:User})

    await sessionUser.users.forEach( user=>{
      if(user.id.toString() !== req.params.userId){
        friends.push({
          fName:user.firstName,
          lName:user.lastName,
          email:user.email
        })

      }
    })  
    res.send(friends)
  })
  } catch (err) {
    next(err)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).send(user);
  } catch (err) {
    next(err)
  }
})

router.post('/invite', async(req, res, next) => {
  try {
    let user = await User.findOne({
      where: {
        email: req.body.email
      }
    })
    const session = await Session.findByPk(req.body.sessionId);
    if (!user) {
      user = await User.create({email: req.body.email, firstName: 'TEMP_ACCOUNT', lastName: 'TEMP_ACCOUNT', password: 'TEMP_ACCOUNT'});
    }
    await session.addUsers(user);
    runMailer(req.body.hostName, req.body.email, session.code, user.firstName, user.confirmationCode);
    res.send(user);
  } catch(err) {
    next(err)
  }
})

router.put('/add/:userId', async (req, res, next) => {
  try {
    const session = await Session.findOne({
      where: {
        code: req.body.code
      }
    });

    const user = await User.findByPk(req.params.userId);
    await session.addUsers(user);
    res.send(session);
  } catch (err) {
    next(err)
  }
})

router.put('/remove/:userId', async (req, res, next) => {
  try {
    const session = await Session.findByPk(req.body.sessionId);
    const user = await User.findByPk(req.params.userId);
    await session.removeUsers(user);
    res.send(session);
  } catch (err) {
    next(err)
  }
})
