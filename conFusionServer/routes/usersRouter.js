const express = require('express');
const bodyParser = require('body-parser')
const passport = require('../passport-authentication').passport
const Users = require('../models/users.model')


const router = express.Router();
router.use(bodyParser.json())

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
  Users.register(new Users({username:req.body.username}),req.body.password,(err,user)=>{
    if(err){
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.json({err})  
    }else{
      passport.authenticate('local')(req,res,()=>{
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json({success:true, status:'Registration successful!'})
      })
    }
  })
})

router.post('/login', passport.authenticate('local'),function(req,res,next){
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.json({success:true, status:'You are successfully logged in'})
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