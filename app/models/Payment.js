const {Schema, model} = require("mongoose")

const PaymentSchema = new Schema({
    orderId: {type: Schema.Types.ObjectId, ref:'orders', required: true},
    amount: {type: Number, required: true},
    userId: {type: Schema.Types.ObjectId, ref:'users', required: true},
    shopId: {type: Schema.Types.ObjectId, ref:'shops', required: true},
    paymentCode: String,
    refId: String,
    createDate: {type: Date, required: true},
    success: { type: Boolean, default: false},

})

const PaymentModel = model("payments", PaymentSchema)

module.exports = PaymentModel
