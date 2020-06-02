const express = require('express');
const router = express.Router();
const passport = require('../passport')

/* GET users listing. */
router.post('/signup', (req,res)=>{
  passport.authenticate('local-signup',(error,user,info)=>{

    if(error){
      return res.status(504).json({
        message:error || 'Ooops, something happened',
        error:error.message || 'Internal server error'
      })
    }
    return res.json(user)

  })(req,res);
});

router.post('/signin', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
