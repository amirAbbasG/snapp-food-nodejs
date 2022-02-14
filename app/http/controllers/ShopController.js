const _ = require('lodash')
const {shopEditValidator} = require('../validators/shopValidator')
const ShopModel = require('../../models/Shop')
const ShopTypes = require('../../models/ShopTypes')





class ShopController {

    // region get list of shops
    async shopsList(req, res) {
        const shops = await ShopModel.find()
            .populate({path: 'comments', select: 'score -_id'})
            .populate({path: 'foods', select: 'price discount -_id'})
            .select("-userNumber -userPassword -ownerFullName")
        res.status(200).send({shops, message: true})
    }

    //endregion

    //region get shop details
    async getShopDetails(req, res) {
        const shopDetails = await ShopModel.findOne({_id: (req.params.shopId)})
            .populate({
                path: 'comments'
            })
            .populate({
                path: 'foods',
                populate: {
                    path: 'comments'
                }
            })
            .select("-userNumber -userPassword")

        res.status(200).send({shopDetails, message: true})
    }

    //endregion


    // region get shop Types
    async shopTypes(req, res){
        const shopTypes = await ShopTypes.find()
        res.status(200).send({shopTypes})
    }
    //endregion

    //region edit shop
    async editShop(req, res) {
        const {error} = shopEditValidator(req.body)
        if(error){
            const err = new Error(error.message)
            err.statusCode = 400
            throw err
        }
        const shop = await ShopModel.findOne({_id: req.user._id})
        if (!shop){
            const err = new Error('فروشگاه  با ای مشخصات پیدا نشد')
            err.statusCode = 404
            throw err
        }
        shop.ownerFullName = req.body.ownerFullName
        shop.shopName = req.body.shopName
        shop.deliveryCost = req.body.deliveryCost
        if(req.file){shop.shopImage = req.file.filename}
        if (req.body.address){shop.address= req.body.address}
        await shop.save()
        const token = shop.getAuthToken()
        res.status(200).send({message: 'done', token})
    }
    //endregion

    //region add coupons
    async addCoupons (req, res) {
        const shop = await ShopModel.findOne({_id: req.user._id})
        if (!shop) return res.status(404).send({message: 'فروشگاه  با این مشخصات پیدا نشد'})
        const code = Math.floor(Math.random()*90000000 + 10000000)
        const coupon = {
            couponCode: code,
            discount: req.body.discount,
            description: req.body.description,
        }
        if (req.file){coupon.icon = req.file.filename}
        shop.coupons.push(coupon)
        await shop.save();
        res.status(201).send({message: "done"})

    }
    //endregion

    //region remove coupons
    async removeCoupons (req, res) {
        const targetShop = await ShopModel.findOne({_id: req.user._id})
        if (!targetShop){
            const err = new Error('فروشگاه  با ای مشخصات پیدا نشد')
            err.statusCode = 404
            throw err
        }
        const foundIndex = targetShop.coupons.findIndex(c => c._id == req.params.couponId)
        targetShop.coupons.splice(foundIndex, 1)
        await targetShop.save();
        const token = targetShop.getAuthToken()
        res.status(201).send({message: "done", token})

    }
    //endregion
}

module.exports = new ShopController()
