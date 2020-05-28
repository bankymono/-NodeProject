const passport = require('passport')
const PassportJwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const config = require('../config')
const User = require('../models/users.model')

const opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey

const JwtStrategy = new PassportJwtStrategy(opts,
    (jwt_payload,done)=>{
        console.log('JWT Payload', jwt_payload)
        User.findOne({_id:jwt_payload._id},(err,user)=>{
            if(err){
                done(err,false)
            }
            else if(user){
                done(null,user)
            }else{
                done(null,false)
            }
        })
    })


module.exports = JwtStrategy