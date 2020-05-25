const mongoose = require('mongoose')
require('mongoose-currency').loadType(mongoose)
const Currency = mongoose.Types.Currency

const Schema = mongoose.Schema

const LeaderSchema = new Schema({
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
  designation:{
    type:String,
    required:true
  },
  abbr:{
    type:String,
    default:true
  }
},
{
  timestamps:true
})

const Leaders = mongoose.model('Leader', LeaderSchema)

module.exports = Leaders;