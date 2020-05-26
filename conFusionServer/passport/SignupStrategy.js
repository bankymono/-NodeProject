const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Users = require('../models/users.model')

const SignupStrategy = new LocalStrategy(Users.authenticate())

module.exports = SignupStrategy
