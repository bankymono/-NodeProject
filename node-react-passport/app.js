const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose')
const passport = require('./passport')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const PORT = process.env.PORT || 8080

const app = express();
mongoose.connect('mongodb://localhost:27017/authentication_db',{
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(passport.initialize())
//app.use(passport.session())

app.listen(PORT,()=>{
  console.log(`Server is listening on PORT ${PORT}`)
})
module.exports = app;
