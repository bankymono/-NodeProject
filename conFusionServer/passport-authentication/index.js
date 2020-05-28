const passport = require('passport')
const LocalStrategy = require('./localAuth')
const User = require('../models/users.model')
const JwtStrategy = require('./jwtStrategy')
const jwt = require('jsonwebtoken')

const config = require('../config')

passport.use('local', LocalStrategy)
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey, {
        expiresIn:3600
    })
}

passport.use('jwt-strategy',JwtStrategy)
exports.verifyUser = passport.authenticate('jwt-strategy',{session:false})
exports.passport = passport

console.log(exports)