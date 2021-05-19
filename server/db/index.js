//this is the access point for all things database related!

const db = require('./db')

const User = require('./models/user')

const Session = require('./models/session')

const UserSession = require('./models/UserSession')

//associations could go here!


Session.belongsToMany(User,{through: UserSession})
User.belongsToMany(Session,{through: UserSession})


// 
User.hasMany(Session, {as: 'host', foreignKey: 'hostId'
})

// Session.hasOne(User, {as: 'host', foreignKey: 'hostId'
// })




module.exports = {
  db,
  models: {
    User,
    Session
  },
}
