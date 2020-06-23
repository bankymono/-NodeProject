const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const verifyUser = require('../passport-authentication').verifyUser
const verifyAdmin = require('../passport-authentication').verifyAdmin
const cors = require('./cors')

const Dishes = require('../models/dishes.model')

const dishRouter = express.Router()

dishRouter.use(bodyParser.json())

dishRouter.route('/').options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

dishRouter.route('/:dishId').options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

dishRouter.route('/:dishId/comments').options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

dishRouter.route('/:dishId/comments/:commentId').options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})


dishRouter.get('/', cors.cors, (req,res,next)=>{
  Dishes.find(req.query)
    .populate('comments.author')
  .then( (dishes)=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(dishes)
  },err=>next(err))
  .catch(err=> next(err))
})

dishRouter.post('/', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
  Dishes.create(req.body)
  .then(dish=>{
    console.log('dish created',dish)
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(dish)
  },err=>next(err))
  .catch(err=> next(err))
})

dishRouter.put('/', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
  res.statusCode=403
  res.end('PUT operation not supported on /dishes')
})

dishRouter.delete('/', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
  Dishes.remove({})
  .then(resp=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(resp)
  },err=>next(err))
  .catch(err=> next(err))
})

dishRouter.get('/:dishId', cors.cors, (req,res,next)=>{
  Dishes.findById(req.params.dishId)
  .populate('comments.author')
  .then(dish=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(dish)
  },err=>next(err))
  .catch(err=> next(err))
})

dishRouter.post('/:dishId', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
  res.statusCode = 403
  res.end('POST operation not supported on /dishes/'+req.params.dishId)
})

dishRouter.put('/:dishId', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
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

dishRouter.delete('/:dishId', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
  Dishes.findByIdAndRemove(req.params.dishId)
  .then(resp=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(resp)
  },err=>next(err))
  .catch(err=> next(err))
})

//comments



module.exports = dishRouter