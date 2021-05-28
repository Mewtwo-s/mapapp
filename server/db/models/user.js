const Sequelize = require('sequelize')
const db = require('../db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const axios = require('axios');

const SALT_ROUNDS = 5;

const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate:{
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  firstName:{
    type: Sequelize.STRING,
    allowNull: false
  },
  lastName:{
    type: Sequelize.STRING,
    allowNull: false
  },
  phoneNum:{
    type: Sequelize.STRING,
    allowNull: true
  },
  preferTransportation:{
    type: Sequelize.ENUM('WALKING', 'DRIVING', 'TRANSIT', 'BICYCLING'),
    defaultValue: 'WALKING',
    allowNull: true
  },
  street: {
    type: Sequelize.STRING,
    allowNull: true
  },
  city: {
    type: Sequelize.STRING,
    allowNull: true
  },
  state: {
    type: Sequelize.STRING,
    allowNull: true
  },
  country: {
    type: Sequelize.STRING,
    allowNull: true
  },
  zipCode: {
    type: Sequelize.STRING,
    allowNull: true
  },
  photo:{
    type: Sequelize.STRING,
    allowNull: true,
    // defaultValue: 'https://www.pinclipart.com/picdir/big/523-5232047_ladybug-clipart-five-ladybug-five-transparent-free-cartoon.png'
  },
  confirmationCode: {
    type: Sequelize.STRING
  }

})

module.exports = User

const generateRandomString = function(length=10){
  return Math.random().toString(20).substr(2, length)
  };

const capFirstName =  name =>  {
  return name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase()
}

User.beforeCreate( (user) => {
  const confirmationCode = generateRandomString();
  user.confirmationCode = confirmationCode;
  user.firstName = capFirstName(user.firstName)
});


/**
 * instanceMethods
 */
User.prototype.correctPassword = function(candidatePwd) {
  //we need to compare the plain version to an encrypted version of the password
  return bcrypt.compare(candidatePwd, this.password);
}

User.prototype.generateToken = function() {
  return jwt.sign({id: this.id}, process.env.JWT)
}

/**
 * classMethods
 */
User.authenticate = async function({ email, password }){
    const user = await this.findOne({where: { email }})
    if (!user || !(await user.correctPassword(password))) {
      const error = Error('Incorrect password'); //show in Log In form
      error.status = 401;
      throw error;
    }
    return user.generateToken();
};

User.findByToken = async function(token) {
  try {
    const {id} = await jwt.verify(token, process.env.JWT)
    const user = User.findByPk(id)
    if (!user) {
      throw 'nooo'
    }
    return user
  } catch (ex) {
    const error = Error('bad token')
    error.status = 401
    throw error
  }
}

/**
 * hooks
 */
const hashPassword = async(user) => {
  //in case the password has been changed, we want to encrypt it with bcrypt
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  }
}

User.beforeCreate(hashPassword)
User.beforeUpdate(hashPassword)
User.beforeBulkCreate(users => {
  users.forEach(hashPassword)
})
