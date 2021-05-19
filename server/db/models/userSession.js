const Sequelize = require('sequelize')
const db = require('../db')
const axios = require('axios');

// after meetup location is generated, make database call, save to this table

// started session
// host set meetup location

const UserSession = db.define('UserSession',{

    currentLat: {type: Sequelize.FLOAT},
    currentLng: {type: Sequelize.FLOAT},
    placeName: {type:Sequelize.TEXT},
    accepted: {type: Sequelize.BOOLEAN, defaultValue: false},
})

UserSession.prototype.setStatus = async function (status) {
    this.accepted = status;
    await this.save();
  }

module.exports = UserSession 