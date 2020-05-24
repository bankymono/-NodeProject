const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user.model')
const bcrypt = require('bcryptjs')

const salt = bcrypt.genSaltSync(10)

const LoginStrategy = new LocalStrategy({passReqToCallback:true},(req,username,password,done)=>{
  const email=req.body.email

  User.findOne({email}).lean().exec((err,user) =>{
    if(err){
      return done(err,null)
    }
    if(!user){
      return done('No user found',null)
    }

    const passwordIsValid=bcrypt.compareSync(password,user.password)

    if(!passwordIsValid){
      return done('email or password not valid',null)
    }

    return done(null,user)
  })
})

module.exports = LoginSigninStrategy