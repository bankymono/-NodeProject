const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const verifyUser = require('../passport-authentication').verifyUser
const verifyAdmin = require('../passport-authentication').verifyAdmin
const cors = require('./cors')

const Promotion = require('../models/promotions.model')

const promoRouter = express.Router()

promoRouter.use(bodyParser.json())


promoRouter.get('/', cors.cors, (req,res,next)=>{
  Promotion.find(req.query)
  .then( (promotions)=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(promotions)
  },err=>next(err))
  .catch(err=> next(err))
})

promoRouter.post('/', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
  Promotion.create(req.body)
  .then(promotion=>{
    console.log('promotion created',promotion)
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(promotions)
  },err=>next(err))
  .catch(err=> next(err))
})

promoRouter.put('/', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
  res.statusCode=403
  res.end('PUT operation not supported on /promotions')
})

promoRouter.delete('/', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
  Promotion.remove({})
  .then(resp=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(resp)
  },err=>next(err))
  .catch(err=> next(err))
})

promoRouter.get('/:promoId', cors.cors, (req,res,next)=>{
  Promotion.findById(req.params.promoId)
  .then(promotion=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(promotion)
  },err=>next(err))
  .catch(err=> next(err))
})

promoRouter.post('/:promoId', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
  res.statusCode = 403
  res.end('POST operation not supported on /promotions/'+req.params.promoId)
})

promoRouter.put('/:promoId', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
  Promotion.findByIdAndUpdate(req.params.promoId,{
    $set:req.body
  },{new:true})
  .then(promotion=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(promotion)
  },err=>next(err))
  .catch(err=> next(err))
})

promoRouter.delete('/:promoId', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
  Promotion.findByIdAndRemove(req.params.promoId)
  .then(resp=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(resp)
  },err=>next(err))
  .catch(err=> next(err))
})


module.exports = promoRouter