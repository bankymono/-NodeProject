const express = require('express')
const bodyParser = require('body-parser')

const promoRouter = express.Router()

promoRouter.use(bodyParser.json())

promoRouter.all('/', (req, res, next) => {
  res.statusCode= 200
  res.setHeader('Content-type','text/plain')
  next()
})

promoRouter.get('/', (req,res,next)=>{
  res.send('will send all the promotions to you')
})

promoRouter.post('/',(req,res,next)=>{
  res.end('Will  add the dish: ' + req.body.name +
  ' with details: ' + req.body.description)
})

promoRouter.put('/',(req,res,next)=>{
  res.statusCode=403
  res.end('PUT operation not supported on /promotions')
})

promoRouter.delete('/',(req,res,next)=>{
  res.statusCode=403
  res.end('deleting all the promotions')
})

promoRouter.all('/:promoId', (req, res, next) => {
  res.statusCode= 200
  res.setHeader('Content-type','text/plain')
  next()
})

promoRouter.get('/:promoId', (req,res,next)=>{
  res.send('will send all the promotions to you')
})

promoRouter.post('/:promoId',(req,res,next)=>{
  res.end('Will  add the dish: ' + req.body.name +
  ' with details: ' + req.body.description)
})

promoRouter.put('/:promoId',(req,res,next)=>{
  res.statusCode=403
  res.end('PUT operation not supported on /promotions')
})

promoRouter.delete('/:promoId',(req,res,next)=>{
  res.statusCode=403
  res.end('deleting all the promotions')
})


module.exports = promoRouter