const {Schema, model} = require('mongoose')


const schema = new Schema({}, {strict: false})
const  SupportedCities = model( "supportedCities", schema, "supportedCities")

module.exports = SupportedCities
