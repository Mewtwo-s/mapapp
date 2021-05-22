const router = require('express').Router()
const { models: { User, Session, userSession }} = require('../db')
const runMailer = require('../../nodemailer');
module.exports = router;
const sequelize = require('sequelize')


router.get('/friends/:userId', async (req, res, next) => {
  try {
    var result = null
    const getSession = async(userId)=>{
      return await User.findByPk(userId, 
        {include:Session})
    }
    
    const getSessionUser = async(sessionId)=>{
      return await Session.findByPk(sessionId,
        {include:User})
    }
    
    const f = async (userId, friends)=>{
    
      let userSessionObj = await getSession(userId)
      if(userSessionObj){
        let userSessions = userSessionObj.sessions
  
        userSessions.forEach(async(session) =>{
          let sessionId = session.id
          let sessionUser = await getSessionUser(sessionId)
        
        sessionUser.users.map( user=>{  
          
          if(user.id.toString() !== req.params.userId && friends.indexOf(user.id)===-1){
            friends.push(
              user.id)
    }
              result = friends
      })})
      return result

      }
     
  }

  console.log(await f(req.params.userId,[]))

  res.send(await f(req.params.userId,[]))
    

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

// router.get('/friends/:userId', async (req, res, next) => {
//   try {
//     let friends = []
//     let relatedSessions = null
//     const result = await User.findOne({
//       where: { id: req.params.userId}, include: Session})
//     relatedSessions = result.sessions
//     relatedSessions.forEach(async(session) =>{
//     let sessionId = session.id
//     let sessionUser = await Session.findOne({
//         where:{id:sessionId}, 
//         include:User})

//     await sessionUser.users.forEach( user=>{
//       if(user.id.toString() !== req.params.userId){
//         friends.push({
//           fName:user.firstName,
//           lName:user.lastName,
//           email:user.email
//         })

//       }
//     })  
//     res.send(friends)
//   })
//   } catch (err) {
//     next(err)
//   }
// })


router.get('/friends/:userId', async (req, res, next) => {
  try {
    let friends = []
    let friendObject = {};
    const user = await User.findOne({
      where: {
         id: req.params.userId
        }, 
        include: {
          model: Session, 
          include: {
            model: User,
            attributes: ["firstName", "lastName", "id", "email"],
            where: {
              id: { 
                [sequelize.Op.not]: req.params.userId}
            }
          }
        }
        
      })
      let relatedSessions = user.sessions
      relatedSessions.forEach(session => friends = friends.concat(session.users));
      friends.forEach((friend) => {
        if (!friendObject[friend.id]) {
          friendObject[friend.id]= {firstName: friend.firstName, lastName: friend.lastName, id: friend.id, email: friend.email}
        }})
      
      let uniqueFriends = Object.keys(friendObject).map(friend => {
        return friendObject[friend];
    })
 
 res.send(uniqueFriends)
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

// router.post('/invite', async(req, res, next) => {
//   try {
//     let user = await User.findOne({
//       where: {
//         email: req.body.email
//       }
//     })
//     const session = await Session.findByPk(req.body.sessionId);
//     // if not existing user
//     if (!user) {
//       user = await User.create({email: req.body.email, firstName: 'TEMP_ACCOUNT', lastName: 'TEMP_ACCOUNT', password: 'TEMP_ACCOUNT'});
//     }
//     await session.addUsers(user);
//     runMailer(req.body.hostName, req.body.email, session.code, user.firstName, user.confirmationCode, user.id);
//     res.send(user);
//   } catch(err) {
//     next(err)
//   }
// })

router.post('/invite', async(req, res, next) => {
  try {
    let user = await User.findOne({
      where: {
        email: req.body.email
      }
    })
    const session = await Session.findByPk(req.body.sessionId);
    // if not existing user
    if (!user) {
      user = await User.create({email: req.body.email, firstName: 'TEMP_ACCOUNT', lastName: 'TEMP_ACCOUNT', password: 'TEMP_ACCOUNT'});
      await session.addUsers(user);
      runMailer(req.body.hostName, req.body.email, session.code, 'Guest', user.confirmationCode, user.id);
      res.send(user);
    }
    else{
      await session.addUsers(user);
      runMailer(req.body.hostName, req.body.email, session.code, user.firstName, user.confirmationCode);
      res.send(user)
    }
    
    
  } catch(err) {
    next(err)
  }
})

router.put('/add/:userId', async (req, res, next) => {
  try {
    console.log('triggered')
    const session = await Session.findOne({
      where: {
        code: req.body.code
      }, 
      include: {
        model: User
      }
    });
    const user = await User.findByPk(req.params.userId);
    await session.addUsers(user);
    session = await Session.findOne({
      where: {
        code: req.body.code
      }, 
      include: {
        model: User
      }
    });
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


router.post('/changePassword/:userId', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.userId)
    await user.update(req.body)
    res.send({token: await user.generateToken()})
    
    
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})
