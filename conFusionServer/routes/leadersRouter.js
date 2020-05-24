const express = require('express')
const bodyParser = require('body-parser')

const leadersRouter = express.Router()

leadersRouter.use(bodyParser.json())

leadersRouter.all('/', (req, res, next) => {
  res.statusCode= 200
  res.setHeader('Content-type','text/plain')
  next()
})

leadersRouter.get('/', (req,res,next)=>{
  res.send('will send all the leaders to you')
})

leadersRouter.post('/',(req,res,next)=>{
  res.end('Will  add the dish: ' + req.body.name +
  ' with details: ' + req.body.description)
})

leadersRouter.put('/',(req,res,next)=>{
  res.statusCode=403
  res.end('PUT operation not supported on /leaders')
})

leadersRouter.delete('/',(req,res,next)=>{
  res.statusCode=403
  res.end('deleting all the leaders')
})

leadersRouter.all('/:leaderId', (req, res, next) => {
  res.statusCode= 200
  res.setHeader('Content-type','text/plain')
  next()
})

leadersRouter.get('/:leaderId', (req,res,next)=>{
  res.send('will send all the leaders to you')
})

leadersRouter.post('/:leaderId',(req,res,next)=>{
  res.end('Will  add the dish: ' + req.body.name +
  ' with details: ' + req.body.description)
})

leadersRouter.put('/:leaderId',(req,res,next)=>{
  res.statusCode=403
  res.end('PUT operation not supported on /leaders')
})

leadersRouter.delete('/:leaderId',(req,res,next)=>{
  res.statusCode=403
  res.end('deleting all the leaders')
})


module.exports = leadersRouter