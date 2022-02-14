const {Schema, model} = require('mongoose')


const schema = new Schema({}, {strict: false})
const  ShopTypes = model( "ShopTypes", schema, "ShopTypes")

module.exports = ShopTypes
