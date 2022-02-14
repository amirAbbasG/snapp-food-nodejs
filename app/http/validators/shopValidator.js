const joi = require('joi')


const shopLoginValidator = (data) => {
    const schema = joi.object({
        userNumber: joi.string().required().min(11).max(11),
        userPassword: joi.string().required().min(4)
    })
    return schema.validate(data)
}

const shopRegisterValidator = (data) => {
    const schema = joi.object({
        userNumber: joi.string().required().min(11).max(11),
        userPassword: joi.string().required().min(4),
        ownerFullName: joi.string().required().min(3),
        category: joi.string().required(),
        shopName: joi.string().required().min(3),
        shopType: joi.string().required(),
        city: joi.string().required(),
        code: joi.string().required(),

    })
    return schema.validate(data)
}

const shopEditValidator = (data) => {
    const schema = joi.object({
        ownerFullName: joi.string().required().min(3),
        shopName: joi.string().min(3),
        shopImage: joi.string(),
        shopLogo: joi.string(),
        deliveryCost: joi.number(),
        address: joi.object({
            city: joi.string().required(),
            title: joi.string(),
            exactAddress: joi.string().min(10)
        })
    })
    return schema.validate(data)
}



module.exports = {shopEditValidator, shopRegisterValidator, shopLoginValidator}
