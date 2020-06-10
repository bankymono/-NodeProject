const passport = require('passport')
const FacebookTokenStrategy = require('passport-facebook-token')
const Users = require('../models/users.model')
const config = require('../config')

const FacebookStrategy = new FacebookTokenStrategy({
    clientID:config.facebook.clientId,
    clientSecret:config.facebook.clientSecret
},
(accessToken,refreshToken,profile,done)=>{
    Users.findOne({facebookId:profile.id}, (err,user) => {
        if(err){
            return done(err,null)
        }else if(!err && user !== null){
            return done(null,user)
        }
        else{
            user = new Users({
                username:profile.displayName
            })
            user.facebookId = profile.id
            user.firstname = profile.name.givenName
            user.lastname = profile.name.familyName
            user.save((err,user)=>{
                if(err){
                    return done(err,false)
                }
                else{
                    return done(null,user)
                }

            }) 
        }
    })
})

module.exports = FacebookStrategy
