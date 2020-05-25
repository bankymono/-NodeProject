const express = require('express');
const bodyParser = require('body-parser')
const Users = require('../models/users.model')

const router = express.Router();
router.use(bodyParser.json())

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', function(req, res, next) {
  Users.findOne({username:req.body.username})
  .then((user)=>{
    if(user !== null){
      const err= new Error('User ' + req.body.username + ' already exists!')
      err.status = 403
      return next(err)
    }else{
      Users.create({
        username:req.body.username,
        password:req.body.password
      })
    }
  })
  .then((user)=>{
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json({status:'Registration successful', user:user})
  },err=>next(err))
  .catch((err)=>next(err))
});

router.post('/login', function(req,res,next){
  if(!req.session.user){
    const authHeader = req.headers.authorization

    if(!authHeader){
        const err = new Error('You are not authenticated!')

        res.setHeader('WWW-Authenticate', 'Basic')
        err.status = 401
        return next(err)
    }

    const auth = new Buffer.from(authHeader.split(' ')[1], 'Base64')
    .toString().split(':');
    
    const username =  auth[0]
    const password =  auth[1]

    Users.findOne({
      username
    })
    .then((user)=>{
      if(user === null){
        const err = new Error('User ' + username + ' does not exist!')
        err.status = 403
        return next(err) 
      }else if( user.password !== password){
        const err = new Error('Your password is incorrect!')
        err.status = 403
        return next(err)
      }else if(user.username === username && user.password === password){     
        req.session.user ='authenticated'
        res.statusCode = 200
        res.setHeader('Content-Type','text/plain')
        res.end('You are authenticated')
      }
    })
    .catch((err)=>next(err))    
}
else{
  res.statusCode = 200
  res.setHeader('Content-Type','text/plain')
  res.end('You are already authenticated!')
}
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