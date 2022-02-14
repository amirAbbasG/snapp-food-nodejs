const joi = require("joi");


const addFoodValidator = (data) => {
    const schema = joi.object({
        name: joi.string().min(3).required(),
        category: joi.string().required(),
        price: joi.number().required(),
        description: joi.string(),
        foodImage: joi.string(),

    })
    return schema.validate(data)
}

const editFoodValidator = (data) => {
    const schema = joi.object({
        name: joi.string().min(3),
        price: joi.number(),
        description: joi.string(),
        foodImage: joi.string(),
        discount: joi.number(),

    })
    return schema.validate(data)
}



module.exports = {addFoodValidator, editFoodValidator}