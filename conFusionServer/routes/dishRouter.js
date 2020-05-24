const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Dishes = require('../models/dishes.model')

const dishRouter = express.Router()

dishRouter.use(bodyParser.json())

dishRouter.get('/', (req,res,next)=>{
  Dishes.find({})
  .then( (dishes)=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(dishes)
  },err=>next(err))
  .catch(err=> next(err))
})

dishRouter.post('/',(req,res,next)=>{
  Dishes.create(req.body)
  .then(dish=>{
    console.log('dish created',dish)
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(dishes)
  },err=>next(err))
  .catch(err=> next(err))
})

dishRouter.put('/',(req,res,next)=>{
  res.statusCode=403
  res.end('PUT operation not supported on /dishes')
})

dishRouter.delete('/',(req,res,next)=>{
  Dishes.remove({})
  .then(resp=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(resp)
  },err=>next(err))
  .catch(err=> next(err))
})

dishRouter.get('/:dishId', (req,res,next)=>{
  Dishes.findById(req.params.dishId)
  .then(dish=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(dish)
  },err=>next(err))
  .catch(err=> next(err))
})

dishRouter.post('/:dishId',(req,res,next)=>{
  res.statusCode = 403
  res.end('POST operation not supported on /dishes/'+req.params.dishId)
})

dishRouter.put('/:dishId',(req,res,next)=>{
  Dishes.findByIdAndUpdate(req.params.dishId,{
    $set:req.body
  },{new:true})
  .then(dish=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(dish)
  },err=>next(err))
  .catch(err=> next(err))
})

dishRouter.delete('/:dishId',(req,res,next)=>{
  Dishes.findByIdAndRemove(req.params.dishId)
  .then(resp=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(resp)
  },err=>next(err))
  .catch(err=> next(err))
})


module.exports = dishRouter