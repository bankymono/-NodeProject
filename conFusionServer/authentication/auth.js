const auth = (req,res,next) =>{
    console.log(req.signedCookies)

    if(!req.signedCookies.user){
        const authHeader = req.headers.authorization

        if(!authHeader){
            const err = new Error('You are not authenticated!')

            res.setHeader('WWW-Authenticate', 'Basic')
            err.status = 401
            return next(err)
        }

        const auth = new Buffer.from(authHeader.split(' ')[1], 'Base64')
        .toString(':')
        
        const username =  auth[0]
        const password =  auth[1]

        if(username === 'admin' && password === 'password'){     
            res.cookie('user', 'admin',{
                signed:true
            })
            next()
        }else{
            const err = new Error('You are not authenticated!')

            res.setHeader('WWW-Authenticate', 'Basic')
            err.status = 401
            return next(err)
        }
    }else{
        if(req.signedCookies.user === 'admin'){
            next()
        }else{
            const err = new Error('You are not authenticated!')

            err.status = 401
            return next(err)
        }
    }
}

module.exports = auth