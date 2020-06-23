const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const verifyUser = require('../passport-authentication').verifyUser
const verifyAdmin = require('../passport-authentication').verifyAdmin
const cors = require('./cors')

const Comments = require('../models/comments.model')

const commentRouter = express.Router()

commentRouter.use(bodyParser.json())

commentRouter.options('/', cors.corsWithOptions, (req,res)=>{res.statusCode(200)})

commentRouter.get('/', cors.cors, (req,res,next)=>{
    Comments.find(req.query)
    .populate('author')
    .then((comments)=>{
        res.statusCode= 200
        res.setHeader('Content-type','application/json')
        res.json(comments)
    },err=>next(err))
    .catch(err=> next(err))
  })
  
commentRouter.post('/', cors.corsWithOptions, verifyUser, (req,res,next)=>{
    if(req.body != null){
        req.body.author = req.user._id
        Comments.create(req.body)
        .then(comment=>{
            Comments.findById(comment._id)
            .populate('author')
            .then( comment =>{
                res.statusCode =200
                res.setHeader('Content-Type','application/json')
                res.json(comment)
            })
      },err=>next(err))
    .catch(err=> next(err))
    }else{
        err = new Error('Comment not found in request body')
        err.status = 404
        return next(err)
    }

    
  })
  
  commentRouter.put('/', cors.corsWithOptions, verifyUser, (req,res,next)=>{
    res.statusCode=403
    res.end('PUT operation not supported on /comments/')
  })
  
  commentRouter.delete('/', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
    Comments.remove({})
    .then(resp=>{
        res.statusCode =200
        res.setHeader('Content-Type','application/json')
        res.json(resp)
    },err=>next(err))
    .catch(err=> next(err))
  })
  
commentRouter.options('/:commentId', cors.corsWithOptions, (req,res)=>{res.statusCode(200)})

commentRouter.get('/:commentId', cors.cors, (req,res,next)=>{
    Comments.findById(req.params.commentId)
    .populate('author')
    .then(comment=>{
        res.statusCode= 200
        res.setHeader('Content-type','application/json')
        res.json(comment)
    },err=>next(err))
    .catch(err=> next(err))
  })
  
  commentRouter.post('/:commentId', cors.corsWithOptions, verifyUser, (req,res,next)=>{
    res.statusCode = 403
    res.end('POST operation not supported on /comments/'+req.params.commentId)
  })
  
  commentRouter.put('/:commentId', cors.corsWithOptions, verifyUser, (req,res,next)=>{
    Comments.findById(req.params.commentId)
    .then(comment=>{
        if(comment !==null){
            if(!comment.author.equals(req.user._id)){
                const err = new Error('You are not authorized to update this comment!')
                err.status = 403
                return next(err)
            }
            req.body.author = req.user
            Comments.findByIdAndUpdate(req.params.commentId,{
                $set:req.body
            },{new:true})
            .then((comment)=>{
                Comments.findById(comment._id)
                .populate('author')
                .then((comment)=>{
                    res.statusCode= 200
                    res.setHeader('Content-type','application/json')
                    res.json(comment)
                })
            }, err=>next(err))
        }else{
            const err = new Error('Comment ' + req.params.commentId + ' not found')
            err.status = 404
            return next(err)
        }
    },err=>next(err))
    .catch(err=> next(err))
  })
  
commentRouter.delete('/:commentId', cors.corsWithOptions, verifyUser, (req,res,next)=>{
    Comments.findById(req.params.commentId)
    .then(comment=>{
      if(comment !==null){
        if(!comments.author.equals(req.user._id)){
            err = new Error('You are not authorized to delete this comment!')
            err.status = 403
            return next(err)
        }
        Comments.findByIdAndRemove(req.params.commentId)
        .then((resp)=>{
            res.statusCode= 200
            res.setHeader('Content-type','application/json')
            res.json(resp)
          },err=>next(err))
      }else{
        err = new Error('Comment' + req.params.commentId + 'not found')
        err.status = 404
        return next(err)
      }
    },err=>next(err))
    .catch(err=> next(err))
  })


  module.exports = commentRouter