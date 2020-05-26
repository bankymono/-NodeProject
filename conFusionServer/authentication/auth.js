const auth = (req,res,next) =>{
    console.log(req.user)

    if(!req.user){
        const err = new Error('You are not authenticated!')

        err.status = 403
        return next(err)

    }else{
        next()
    }
}

module.exports = auth