const mongoose = require('mongoose')




const ActiveNumberSchema = new mongoose.Schema({
    number: {type: String, required: true, max: 11, min: 11, unique: true},

})



const ActiveNumberModel = mongoose.model('activeNumberSchemas', ActiveNumberSchema)

module.exports = ActiveNumberModel