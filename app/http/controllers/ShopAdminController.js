const bcrypt = require('bcrypt')
const _ = require('lodash')
const { shopLoginValidator, shopRegisterValidator} = require('../validators/shopValidator')
const ShopModel = require('../../models/Shop')
const ActiveNumberModel = require('../../models/ActiveNumber')
const {isValidCode, sendCode} = require("../hellpers/sendCode");
const {numberValidator} = require("../validators/UserValidator");
const SupportedCities = require('../../models/SuportedCities')




class ShopAdminController {

    //region get supported cities
    async supportedCities(req, res){
        const supportedCitiesList = await SupportedCities.find()
        res.status(200).send({supportedCities: supportedCitiesList})
    }
    //endregion

    //region check number and send code
    async checkNumber(req, res) {
        const {error} = numberValidator({number: req.body.userNumber})
        if (error) {
            const err = new Error(error.message)
            err.statusCode = 400
            throw err
        }
        const shop = await ShopModel.findOne({userNumber: req.body.userNumber})
        if (shop) {
            const err = new Error("فروشگاهی با این شماره قبلا ثبت شده")
            err.statusCode = 400
            throw err
        }
        sendCode(req.body.userNumber, (response, status) => {
            if (status === 200) {
                res.status(200).send({message: 'done', action: "register"})
            } else {
                const err = new Error("مشکلی پیش آمده")
                err.statusCode = status
                throw err
            }
        })
    }
    //endregion

    //region register shop
    async register(req, res) {
        console.log(req.body)
        const {error} = shopRegisterValidator(req.body)
        if(error){
            const err = new Error(error.message)
            err.statusCode = 400
            throw err
        }
        if (isValidCode(req.body.code, req.body.userNumber)) {
            const activeNumber = await new ActiveNumberModel({number: req.body.userNumber})
            await activeNumber.save()
        } else {
            const error = new Error("کد ارسال شده نادرست است")
            error.statusCode = 400
            throw error
        }
        const activeNumber = await ActiveNumberModel.findOne({number: req.body.userNumber})
        if (!activeNumber){
            const error = new Error("شماره فعال نشده")
            error.statusCode = 400
            throw error
        }
        const newShop = await new ShopModel(_.pick(req.body, ['shopName','ownerFullName','userNumber', 'shopType', "category"]))
        newShop.address = {city : req.body.city}
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.userPassword, salt)
        newShop.userPassword = hashedPassword
        await newShop.save()
        const token = newShop.getAuthToken()
        res.status(201).send({message: 'done', token, userId: newShop._id})
    }
    //endregion

    //region login shop
    async login(req, res) {
        const {error} = shopLoginValidator(req.body)
        if(error){
            const err = new Error(error.message)
            err.statusCode = 400
            throw err
        }
        const shop = await ShopModel.findOne({userNumber: req.body.userNumber})
        if (!shop){
            const err = new Error('فروشگاه  با ای مشخصات پیدا نشد')
            err.statusCode = 404
            throw err
        }
        const result = await bcrypt.compare(req.body.userPassword, shop.userPassword)
        if (!result){
            const err = new Error('فروشگاه  با ای مشخصات پیدا نشد')
            err.statusCode = 404
            throw err
        }
        const token = shop.getAuthToken()
        res.status(200).send({message: 'done', token})

    }
    //endregion
}

module.exports = new ShopAdminController()
