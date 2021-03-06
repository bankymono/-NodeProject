const express = require('express');
const bodyParser = require('body-parser')
const passport = require('../passport-authentication').passport
const Users = require('../models/users.model')
const verifyAdmin = require('../passport-authentication').verifyAdmin
const verifyUser = require('../passport-authentication').verifyUser
const getToken = require('../passport-authentication').getToken

const cors = require('./cors')



const router = express.Router();
router.use(bodyParser.json())

/* GET users listing. */
router.options('*',cors.corsWithOptions,(req,res)=>{
  res.sendStatus(200)
})
router.get('/', cors.corsWithOptions, verifyUser, verifyAdmin, function(req, res, next) {
  Users.find({})
  .then( (users)=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(users)
  },err=>next(err))
  .catch(err=> next(err))
});

router.post('/signup', cors.corsWithOptions, function(req, res, next) {
  Users.register(new Users({username:req.body.username}),req.body.password,(err,user)=>{
    if(err){
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.json({err})  
    }else{
      if(req.body.firstname)
        user.firstname = req.body.firstname
      if(req.body.lastname)
        user.lastname = req.body.lastname
      user.save((err,user)=>{
        if(err){
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.json({err})
          return
        }
        passport.authenticate('local')(req,res,()=>{
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json({success:true, status:'Registration successful!'})
        })
      })      
    }
  })
})

router.post('/login', cors.corsWithOptions, function(req,res,next){
  passport.authenticate('local', (err,user, info)=>{
    if(err)
      return next(err)

    if(!user){
      res.statusCode = 401
      res.setHeader('Content-Type', 'application/json')
      res.json({success: false, status: 'Login Unsuccessful!', err:info})
    }

    req.logIn(user, (err)=>{
      if(err){
        res.statusCode = 401
        res.setHeader('Content-Type', 'application/json')
        res.json({success: false, status: 'Login Unsuccessful!', err:'Could not log in user!'})
      }
      const token = getToken({_id:req.user._id})

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json({success: true, status: 'Login Successful!', token:token})
    })
  })(req,res,next)
  
})

router.get('/logout', cors.corsWithOptions, function(req,res,next){
  if(req.session){
    req.session.destroy()
    res.clearCookie('session-id')
    res.redirect('/')
  }
  else{
    const err = new Error('You are not logged in!')
    err.status=403
    next(err)
  }
})

router.get('/facebook/token', passport.authenticate('facebook-token'), (req,res)=>{
   if(req.user){
    const token = getToken({_id:req.user._id})
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json({success: true, token: token, status: 'You are successfully logged in'})
   }
})

router.get('/checkJWTToken',cors.corsWithOptions,(req,res,next)=>{
  passport.authenticate('jwt-strategy',{session:false}, (err,user,info)=>{
    if(err)
      return next(err)
    if(!user){
      res.statusCode = 401
      res.setHeader('Content-Type','application/json')
      return res.json({status:'JWT invalid!', success:false, err:info})
    }
    else{
      res.statusCode = 200
      res.setHeader('Content-Type','application/json')
      return res.json({status:'JWT valid!', success:true, user:user})
    }
  })(req,res,next)  
})

module.exports = router;