const Sequelize = require('sequelize')
const db = require('../db')
const axios = require('axios');

// after meetup location is generated, make database call, save to this table

// started session
// host set meetup location

const userSession = db.define('userSession',{

    currentLat: {
      type: Sequelize.FLOAT
    },
    currentLng: {
      type: Sequelize.FLOAT
    },
    accepted: {
      type: Sequelize.BOOLEAN, defaultValue: false
    },
    arrived: {
      type: Sequelize.BOOLEAN, defaultValue: false
    },
})

userSession.prototype.setStatus = async function (status) {
    this.accepted = status;
    await this.save();
  }

module.exports = userSession 