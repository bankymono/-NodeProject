const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const verifyUser = require('../passport-authentication').verifyUser
const verifyAdmin = require('../passport-authentication').verifyAdmin
const cors = require('./cors')


const Leaders = require('../models/leaders.model')

const leadersRouter = express.Router()

leadersRouter.use(bodyParser.json())

leadersRouter.get('/', cors.cors, (req,res,next)=>{
  Leaders.find(req.query)
  .then( (leaders)=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(leaders)
  },err=>next(err))
  .catch(err=> next(err))
})

leadersRouter.post('/', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
  Leaders.create(req.body)
  .then(leader=>{
    console.log('leader created',leader)
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(leaders)
  },err=>next(err))
  .catch(err=> next(err))
})

leadersRouter.put('/', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
  res.statusCode=403
  res.end('PUT operation not supported on /leaders')
})

leadersRouter.delete('/', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
  Leaders.remove({})
  .then(resp=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(resp)
  },err=>next(err))
  .catch(err=> next(err))
})

leadersRouter.get('/:leaderId', cors.cors, (req,res,next)=>{
  Leaders.findById(req.params.leaderId)
  .then(leader=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(leader)
  },err=>next(err))
  .catch(err=> next(err))
})

leadersRouter.post('/:leaderId', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
  res.statusCode = 403
  res.end('POST operation not supported on /leaders/'+req.params.leaderId)
})

leadersRouter.put('/:leaderId', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
  Leaders.findByIdAndUpdate(req.params.leaderId,{
    $set:req.body
  },{new:true})
  .then(leader=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(leader)
  },err=>next(err))
  .catch(err=> next(err))
})

leadersRouter.delete('/:leaderId', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
  Leaders.findByIdAndRemove(req.params.leaderId)
  .then(resp=>{
    res.statusCode= 200
    res.setHeader('Content-type','application/json')
    res.json(resp)
  },err=>next(err))
  .catch(err=> next(err))
})


module.exports = leadersRouter