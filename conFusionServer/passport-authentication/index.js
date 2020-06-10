const passport = require('passport')
const LocalStrategy = require('./localAuth')
const User = require('../models/users.model')
const JwtStrategy = require('./jwtStrategy')
const jwt = require('jsonwebtoken')
const FacebookStrategy = require('./facebookStrategy')

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
exports.verifyAdmin = (req,res,next) =>{
    if(!req.user.admin){
        const err = new Error("You are not Authorized to perform this operation!")
        err.status = 403
        return next(err)
    }
    else{
        return next()
    }
}

passport.use('facebook-token', FacebookStrategy)

exports.passport = passport

console.log(exports)