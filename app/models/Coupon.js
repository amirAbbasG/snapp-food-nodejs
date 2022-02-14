const {Schema} = require('mongoose')


const CouponSchema = new Schema({
    description: {type: String, required: true},
    discount: {type: Number, required: true},
    couponCode: {type: String, required: true},
    icon: {type: String, default: 'Custom-Icon-Design-Pretty-Office-11-Coupon.ico'},
    usersUsed: [{type: Schema.Types.ObjectId, ref: 'users'}],
    shopId: {type: Schema.Types.ObjectId, ref: 'shops'}
})


module.exports = CouponSchema
