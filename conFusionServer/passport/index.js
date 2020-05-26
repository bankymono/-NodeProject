const passport = require('passport')
const Users = require('../models/users.model')

const AuthStrategy = require('./localAuth')

passport.use('local-auth',AuthStrategy)

passport.serializeUser(Users.serializeUser())
passport.deserializeUser(Users.deserializeUser())

module.exports= passport