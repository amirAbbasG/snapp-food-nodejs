const _ = require('lodash')
const {addFoodValidator, editFoodValidator} = require('../validators/FoodValidator')
const ShopModel = require('../../models/Shop')
const FoodModel = require('../../models/Food')




class FoodController {

    //region get list of foods
    async foodsList(req, res) {
        const foods = await FoodModel.find({shopId: req.params.shopId})
            .populate({path: 'comments', select: 'score'})

        res.status(200).send({foods, message: true})
    }

    //endregion

    //region get food details
    async getFoodDetails(req, res) {
        const foodDetails = await FoodModel.findOne({_id: (req.params.foodId)})
            .populate({
                path: 'comments'
            })
        res.status(200).send({foodDetails, message: true})
    }

    //endregion

    //region add food
    async addFood(req, res) {
        const {error} = addFoodValidator(req.body)
        if(error){
            const err = new Error(error.message)
            err.statusCode = 400
            throw err
        }
        const newFood = await new FoodModel(_.pick(req.body,["name", "price", "description", "category"]))
        newFood.shopId = req.user._id
        const shop = await ShopModel.findOne({_id : req.user._id })
        shop.foods.push(newFood._id)
        await shop.save()
        if (req.file){newFood.foodImage = req.file.filename}
        await newFood.save()
        res.status(201).send({message: "done", food: newFood})
    }
    //endregion

    //region delete food
    async deleteFood(req, res) {
        const targetFood = await FoodModel.findOne({_id: req.params.foodId})
        if (!targetFood){
            const err = new Error('غدا  با ای مشخصات پیدا نشد')
            err.statusCode = 404
            throw err
        }
        if (req.user._id !== targetFood.shopId)return res.status(404).send({message: "شما اجازه دسترسی با این غذا را ندارید"})
        await FoodModel.deleteOne({_id: req.params.foodId})
        return res.status(200).send({message: "done"})

    }
    //endregion

    //region edit food
    async editFood(req, res) {
        const {error} = editFoodValidator(req.body)
        if(error){
            const err = new Error(error.message)
            err.statusCode = 400
            throw err
        }
        const targetFood = await FoodModel.findOne({_id: req.params.foodId})
        if (!targetFood){
            const err = new Error('غدا  با ای مشخصات پیدا نشد')
            err.statusCode = 404
            throw err
        }
        if (req.user._id !== targetFood.shopId){
            const err = new Error('شما اجازه دسترسی با این غذا را ندارید')
            err.statusCode = 401
            throw err
        }
        targetFood.name = req.body.name
        targetFood.price = req.body.price
        targetFood.description = req.body.description
        targetFood.discount = req.body.discount
        if (req.file) {targetFood.foodImage = req.file.filename}
        await targetFood.save();
        res.status(200).send({message: "done", food: targetFood})
    }
    //endregion

    //region set discount for food
    async setDiscount (req, res) {
        const discount = parseInt(req.body.discount)
        if (! discount || discount > 100){
            const err = new Error('تخفیف باید بین صفر تا صد باشد')
            err.statusCode = 400
            throw err
        }
        const targetFood = await FoodModel.findOne({_id: req.params.foodId})
        if (!targetFood){
            const err = new Error('غدا  با ای مشخصات پیدا نشد')
            err.statusCode = 404
            throw err
        }
        if (req.user._id != targetFood.shopId){
            const err = new Error('شما اجازه دسترسی با این غذا را ندارید')
            err.statusCode = 401
            throw err
        }
        targetFood.discount = discount
        await targetFood.save();
        res.status(200).send({message: "done"})
    }
    //endregion

}

module.exports = new FoodController()
