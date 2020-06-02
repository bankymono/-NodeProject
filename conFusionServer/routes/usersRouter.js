const express = require('express');
const bodyParser = require('body-parser')
const passport = require('../passport-authentication').passport
const Users = require('../models/users.model')
const verifyAdmin = require('../passport-authentication').verifyAdmin
const verifyUser = require('../passport-authentication').verifyUser
const getToken = require('../passport-authentication').getToken


const router = express.Router();
router.use(bodyParser.json())

/* GET users listing. */
router.get('/',verifyUser, verifyAdmin, function(req, res, next) {
  Users.find({})
  .then( (users)=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(users)
  },err=>next(err))
  .catch(err=> next(err))
});

router.post('/signup', function(req, res, next) {
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

router.post('/login', passport.authenticate('local'),function(req,res,next){
  const token = getToken({_id:req.user._id})
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.json({success: true, token: token, status: 'You are successfully logged in'})
})

router.get('/logout',function(req,res,next){
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

module.exports = router;