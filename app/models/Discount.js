const {Schema, model} = require('mongoose')





const DiscountSchema = new Schema({
    title: {type: String, required: true},
    discount: {type: Number, default: 0, max: 100},
    description: String,
    discountCode: {type: String, required: true},
    userUsed: [{type: Schema.Types.ObjectId, ref: 'shops'}],
    count: {type: Number, required: true},
    maxDiscount: Number
})

const DiscountModel = model('discounts', DiscountSchema)

module.exports = DiscountModel
