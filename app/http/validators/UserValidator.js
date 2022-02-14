const joi = require('joi')
const Joi = require("joi");


const numberValidator = (data) => {
    const schema = joi.object({
        number: joi.string().required().min(11).max(11),
    })
    return schema.validate(data)
}

const userLoginValidator = (data) => {
    const schema = joi.object({
        number: joi.string().required().min(11).max(11),
        password: joi.string().required().min(4)
    })
    return schema.validate(data)
}

const userRegisterValidator = (data) => {
    const schema = joi.object({
        number: joi.string().required().min(11).max(11),
        password: joi.string().required().min(4),
        fullName: joi.string().min(3),

    })
    return schema.validate(data)
}
const changePasswordValidator = (data) => {
    const schema = joi.object({
        number: joi.string().required().min(11).max(11),
        password: joi.string().required().min(4),
        code: joi.string().min(5).max(5),

    })
    return schema.validate(data)
}

const userEditValidator = (data) => {
    const schema = joi.object({
        creditCardNumber: joi.string().min(16).max(16),
        email: joi.string().trim().email(),
        fullName: joi.string().min(3).required(),
        address: [joi.object({
            city: joi.string().required(),
            title: joi.string(),
            exactAddress: joi.string().min(10),
            longitude: joi.number(),
            latitude: joi.number()
        })]
    })
    return schema.validate(data)
}



const commentValidator = (data) => {
    const schema = joi.object({
        text: joi.string().min(1),
        score: joi.number().min(0).max(5),

    })
    return schema.validate(data)
}



module.exports = {userLoginValidator, userRegisterValidator,
    userEditValidator, numberValidator, commentValidator, changePasswordValidator}
