const {Schema, model, Types} = require('mongoose')
const jwt = require('jsonwebtoken')
const config = require('config')
const AddressSchema = require('./Address')



const UserSchema = new Schema({
    number: {type: String, required: true, max: 11, min: 11, unique: true},
    fullName: {type: String, required: true, min: 3},
    email: {type: String},
    favoriteShop:[{type: Schema.Types.ObjectId, ref: "shops"}],
    creditCardNumber: {type: String, min: 16, max: 16},
    password: {type: String, required: true, min:4},
    addresses: [AddressSchema],
    usedCoupon:[]

})

UserSchema.methods.genAuthToken = function () {
    const data = {
        number: this.number,
        fullName: this.fullName,
        _id: this._id,
        role: "user"

    }
    return jwt.sign(data, config.get("jwtKey"), {
        expiresIn: '36h'
    } )
}

const UserModel = model('users', UserSchema)

module.exports = UserModel
