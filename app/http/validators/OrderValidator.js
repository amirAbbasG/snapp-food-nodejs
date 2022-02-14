const joi = require("joi");


const orderValidator = (data) => {
    const schema = joi.object({
        shopId: joi.required(),
        foods: joi.array().items(joi.object({
            foodId: joi.string().required(),
            name: joi.string().required(),
            price: joi.number().required(),
            count: joi.number(),
        })).required()

    })
    return schema.validate(data)
}

module.exports = {orderValidator}
