const mongoose = require('mongoose')
require('mongoose-currency').loadType(mongoose)
const Currency = mongoose.Types.Currency

const Schema = mongoose.Schema

const promoSchema = new Schema({
  name: {
    type:String,
    required:true,
    unique:true
  },
  description:{
    type: String,
    required:true
  },
  image:{
    type:String,
    required:true
  },
  label:{
    type:String,
    default:true
  },
  price:{
    type:Currency,
    required:true,
    min:0,
  }
},
{
  timestamps:true
})

const Promotions = mongoose.model('Promotion', promoSchema)

module.exports = Promotions;