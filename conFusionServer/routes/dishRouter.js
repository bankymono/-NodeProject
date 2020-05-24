const express = require('express')
const bodyParser = require('body-parser')

const dishRouter = express.Router()

dishRouter.use(bodyParser.json())

dishRouter.all('/', (req, res, next) => {
  res.statusCode= 200
  res.setHeader('Content-type','text/plain')
  next()
})

dishRouter.get('/', (req,res,next)=>{
  res.send('will send all the dishes to you')
})

dishRouter.post('/',(req,res,next)=>{
  res.end('Will  add the dish: ' + req.body.name +
  ' with details: ' + req.body.description)
})

dishRouter.put('/',(req,res,next)=>{
  res.statusCode=403
  res.end('PUT operation not supported on /dishes')
})

dishRouter.delete('/',(req,res,next)=>{
  res.statusCode=403
  res.end('deleting all the dishes')
})

dishRouter.all('/:dishId', (req, res, next) => {
  res.statusCode= 200
  res.setHeader('Content-type','text/plain')
  next()
})

dishRouter.get('/:dishId', (req,res,next)=>{
  res.send('will send all the dishes to you')
})

dishRouter.post('/:dishId',(req,res,next)=>{
  res.end('Will  add the dish: ' + req.body.name +
  ' with details: ' + req.body.description)
})

dishRouter.put('/:dishId',(req,res,next)=>{
  res.statusCode=403
  res.end('PUT operation not supported on /dishes')
})

dishRouter.delete('/:dishId',(req,res,next)=>{
  res.statusCode=403
  res.end('deleting all the dishes')
})


module.exports = dishRouter