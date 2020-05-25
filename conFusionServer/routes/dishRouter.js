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

//comments
dishRouter.get('/:dishId/comments', (req,res,next)=>{
  Dishes.findById(req.params.dishId)
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

dishRouter.post('/:dishId/comments',(req,res,next)=>{
  Dishes.findById(req.params.dishId)
  .then(dish=>{
    if(dish !==null){
      dish.comments.push(req.body)
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

dishRouter.put('/:dishId/comments',(req,res,next)=>{
  res.statusCode=403
  res.end('PUT operation not supported on /dishes/'
  + req.params.dishId + '/comments')
})

dishRouter.delete('/:dishId/comments',(req,res,next)=>{
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

dishRouter.get('/:dishId/comments/:commentId', (req,res,next)=>{
  Dishes.findById(req.params.dishId)
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

dishRouter.post('/:dishId/comments/:commentId',(req,res,next)=>{
  res.statusCode = 403
  res.end('POST operation not supported on /dishes/'+req.params.dishId
  + '/comments/'+req.params.commentId)
})

dishRouter.put('/:dishId/comments/:commentId',(req,res,next)=>{
  Dishes.findById(req.params.dishId)
  .then(dish=>{
    if(dish !==null && dish.comments.id(req.params.commentId) !== null){
      if(req.body.rating){
        dish.comments.id(req.params.commentId).rating = req.body.rating
      }
      if(req.body.comment){
        dish.comments.id(req.params.commentId).comment = req.body.comment
      }
      dish.save()
      .then((dish)=>{
        res.statusCode= 200
        res.setHeader('Content-type','application/json')
        res.json(dish)
      }, err=>next(err))
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

dishRouter.delete('/:dishId/comments/:commentId',(req,res,next)=>{
  Dishes.findById(req.params.dishId)
  .then(dish=>{
    if(dish !==null && dish.comments.id(req.params.commentId) !== null){
      dish.comments.id(req.params.commentId).remove()
      dish.save()
      .then((dish)=>{
        res.statusCode= 200
        res.setHeader('Content-type','application/json')
        res.json(dish)
      },err=>next(err))
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


module.exports = dishRouter