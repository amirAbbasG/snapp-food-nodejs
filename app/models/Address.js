const mongoose = require('mongoose')


const AddressSchema = new mongoose.Schema({
    city: {type: String, required: true},
    title: String,
    exactAddress: {type: String, min: 10},
    longitude: {type: Number, default: 0},
    latitude: {type: Number, default: 0}
})

module.exports = AddressSchema
