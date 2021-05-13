//this is the access point for all things database related!

const db = require('./db')

const User = require('./models/user')

const Session = require('./models/session')

const userSession = require('./models/userSession')

//associations could go here!


Session.belongsToMany(User,{through: userSession})
User.belongsToMany(Session,{through: userSession})


// 
User.hasMany(Session, {foreignKey:'hostId'
})
Session.belongsTo(User,{foreignKey:'hostId'
} )



module.exports = {
  db,
  models: {
    User,
    Session
  },
}
