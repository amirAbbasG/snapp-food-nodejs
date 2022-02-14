const {Schema, model} = require('mongoose')





const FoodSchema = new Schema({
    name: {type: String, required: true, min:3},
    category: {type: String, required: true},
    price: {type: Number, required: true},
    shopId: {type: Schema.Types.ObjectId, ref: 'shops'},
    comments: [{type: Schema.Types.ObjectId, ref: 'comments'}],
    discount: {type: Number, default: 0, max: 100},
    description: String,
    foodImage: {type: String, default: "8103658_food-icon.png"},
    totalOrdered : {type: Number, default: 0},
})

const FoodModel = model('foods', FoodSchema)

module.exports = FoodModel
