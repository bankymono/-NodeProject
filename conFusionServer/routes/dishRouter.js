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
  Dishes.find({})
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
dishRouter.get('/:dishId/comments', cors.cors, (req,res,next)=>{
  Dishes.findById(req.params.dishId)
  .populate('comments.author')
  .then( (dish)=>{
    if(dish !==null){
      res.statusCode= 200
      res.setHeader('Content-type','application/json')
      res.json(dish.comments)
    }else{
      err = new Error('Dish' + req.params.dishId + 'not found')
      err.status = 404
      return next(err)
    }
  },err=>next(err))
  .catch(err=> next(err))
})

dishRouter.post('/:dishId/comments', cors.corsWithOptions, verifyUser, (req,res,next)=>{
  Dishes.findById(req.params.dishId)
  .then(dish=>{
    if(dish !==null){
      req.body.author = req.user._id
      dish.comments.push(req.body)
      dish.save()
      .then((dish)=>{
        Dishes.findById(dish._id)
        .populate('comments.author')
        .then((dish)=>{
          res.statusCode = 200
          res.setHeader('Content-type','application/json')
          res.json(dish)
        })
      },err=>next(err))  
    }else{
      err = new Error('Dish' + req.params.dishId + 'not found')
      err.status = 404
      return next(err)
    }
  },err=>next(err))
  .catch(err=> next(err))
})

dishRouter.put('/:dishId/comments', cors.corsWithOptions, verifyUser, (req,res,next)=>{
  res.statusCode=403
  res.end('PUT operation not supported on /dishes/'
  + req.params.dishId + '/comments')
})

dishRouter.delete('/:dishId/comments', cors.corsWithOptions, verifyUser, verifyAdmin, (req,res,next)=>{
  Dishes.findById(req.params.dishId)
  .then(dish=>{
    if(dish !==null){
      for (var i = (dish.comments.length-1);i>=0;i--){
        dish.comments.id(dish.comments[i]._id).remove()
      }
      dish.save()
      .then((dish)=>{
        res.statusCode= 200
        res.setHeader('Content-type','application/json')
        res.json(dish)
      },err=>next(err))
    }else{
      err = new Error('Dish' + req.params.dishId + 'not found')
      err.status = 404
      return next(err)
    }
  },err=>next(err))
  .catch(err=> next(err))
})

dishRouter.get('/:dishId/comments/:commentId', cors.cors, (req,res,next)=>{
  Dishes.findById(req.params.dishId)
  .populate('comments.author')
  .then(dish=>{
    if(dish !==null && dish.comments.id(req.params.commentId) !== null){
      res.statusCode= 200
      res.setHeader('Content-type','application/json')
      res.json(dish.comments)
    }else if (dish == null){
      err = new Error('Dish' + req.params.dishId + 'not found')
      err.status = 404
      return next(err)
    }else{
      err = new Error('Comment' + req.params.commentId + 'not found')
      err.status = 404
      return next(err)
    }
  },err=>next(err))
  .catch(err=> next(err))
})

dishRouter.post('/:dishId/comments/:commentId', cors.corsWithOptions, verifyUser, (req,res,next)=>{
  res.statusCode = 403
  res.end('POST operation not supported on /dishes/'+req.params.dishId
  + '/comments/'+req.params.commentId)
})

dishRouter.put('/:dishId/comments/:commentId', cors.corsWithOptions, verifyUser, (req,res,next)=>{
  Dishes.findById(req.params.dishId)
  .then(dish=>{
    if(dish !==null && dish.comments.id(req.params.commentId) !== null){
      if(dish.comments.id(req.params.commentId).author.equals(req.user._id)){
        if(req.body.rating){
          dish.comments.id(req.params.commentId).rating = req.body.rating
        }
        if(req.body.comment){
          dish.comments.id(req.params.commentId).comment = req.body.comment
        }
        dish.save()
        .then((dish)=>{
          Dishes.findById(dish._id)
          .populate('comments.author')
          .then((dish)=>{
            res.statusCode= 200
            res.setHeader('Content-type','application/json')
            res.json(dish)
          })
        }, err=>next(err))
      }else{
        err = new Error('You are not authorized to update this comment!')
        err.status = 403
        return next(err)  
      }
    }else if (dish == null){
      err = new Error('Dish' + req.params.dishId + 'not found')
      err.status = 404
      return next(err)
    }else{
      err = new Error('Comment' + req.params.commentId + 'not found')
      err.status = 404
      return next(err)
    }
  },err=>next(err))
  .catch(err=> next(err))
})

dishRouter.delete('/:dishId/comments/:commentId', cors.corsWithOptions, verifyUser, (req,res,next)=>{
  Dishes.findById(req.params.dishId)
  .then(dish=>{
    if(dish !==null && dish.comments.id(req.params.commentId) !== null){
      console.log('req:',req.user._id)
      if(dish.comments.id(req.params.commentId).author.equals(req.user._id)){
        console.log("req.user._id: ",req.user._id,"dish.comment.id(author_id): ",dish.comments.id(req.params.commentId).author)
        dish.comments.id(req.params.commentId).remove()
        dish.save()
        .then((dish)=>{
          Dishes.findById(dish._id)
          .populate('comments.author')
          .then((dish)=>{
            res.statusCode= 200
            res.setHeader('Content-type','application/json')
            res.json(dish)
          })
        },err=>next(err))
    }else{
      err = new Error('You are not authorized to delete this comment!')
      err.status = 403
      return next(err)     
    }
    }else if (dish === null){
      err = new Error('Dish' + req.params.dishId + 'not found')
      err.status = 404
      return next(err)
    }else{
      err = new Error('Comment' + req.params.commentId + 'not found')
      err.status = 404
      return next(err)
    }
  },err=>next(err))
  .catch(err=> next(err))
})


module.exports = dishRouter