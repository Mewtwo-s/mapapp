const Sequelize = require('sequelize')
const db = require('../db')
const axios = require('axios');

// after meetup location is generated, make database call, save to this table

// started session
// host set meetup location

const Session = db.define('session',{

    code: {type: Sequelize.STRING},
    lat: {type: Sequelize.FLOAT},
    lng: {type: Sequelize.FLOAT},
    status: {type: Sequelize.ENUM('Pending', 'Active', 'Completed'),
    defaultValue:'Pending'},
    type: {type: Sequelize.ENUM('coffee', 'bar'),
    defaultValue:'coffee'}
    })

Session.beforeCreate( (session) => {
    const generateRandomString = function(length=6){
        return Math.random().toString(20).substr(2, length)
        };
    const code = generateRandomString();
    session.code = code;
  });


  module.exports = Session;