const _ = require('lodash')
const ShopModel = require('../../models/Shop')
const FoodModel = require('../../models/Food')
const OrderModel = require("../../models/Order");
const UserModel = require("../../models/User");
const DiscountModel = require("../../models/Discount");
const PaymentModel = require("../../models/Payment");
const successPayment = require("../../http/hellpers/paymentResultMessage");






class OrderController {



    //region get list of Payments of a user
    async getPayments(req, res) {
        const userPayments = await PaymentModel.find({userId: req.user._id})
            .populate({path: "shopId", select: "shopName"})
        res.status(200).send({userPayments, message: true})
    }

    //endregion

    // region get list of order of a user
    async getOrders(req, res) {
        const userOrders = await OrderModel.find({userId: req.user._id})
            .populate({path: "shopId", select: "shopName shopLogo deliveryCost "})
        res.status(200).send({userOrders, message: true})
    }

    //endregion

    //region user add food to cart
    async addToCart(req, res) {
        const food = await FoodModel.findById(req.params.foodId)
        const user = await UserModel.findOne({_id: req.user._id})
        if (!user) {
            const error = new Error("کاربری با ای مشخصات پیدا نشد")
            error.statusCode = 404
            throw error
        }
        let order = await OrderModel.findOne({userId: req.user._id, isPaid: false, shopId: food.shopId})
        if (order != null) {
            let orderFood = order.foods.find(f => f._id == food._id)
            if (orderFood != null) {
                orderFood.count += 1
            } else {
                orderFood = {
                    ..._.pick(food, ["_id", "name", "price", "shopId", "discount", "foodImage"]),
                    count: 1
                }
                order.foods.push(orderFood)
            }
        } else {
            order = new OrderModel({
                shopId: food.shopId,
                userId: req.user._id,
                address: user.addresses[0],
                createDate: Date.now(),
                foods: [{
                    ..._.pick(food, ["_id", "name", "price", "shopId", "discount", "foodImage"]),
                    count: 1
                }]
            })
        }
        order.amount = order.foods.reduce((acc, item) => {
            return acc + item.price * item.count
        }, 0)
        order.amountByDiscount = order.foods.reduce((acc, item) => {
            return acc + (item.price - (item.price * item.discount) / 100) * item.count
        }, 0)
        await order.save();
        const newOrder = await OrderModel.findOne({_id: order._id})
            .populate({path: "shopId", select: "shopName shopLogo deliveryCost"})
        res.status(201).send({message: 'done', order: newOrder})
    }

    //endregion

    //region remove food from cart
    async removeFoodFromCart(req, res) {
        const food = await FoodModel.findOne({_id: req.params.foodId})
        let order = await OrderModel.findOne({userId: req.user._id, isPaid: false, shopId: food.shopId})
        const targetFood = order.foods.find(f => f._id == req.params.foodId)
        if (targetFood != null) {
            if (order.foods.count == 1 && order.foods[0].count == 1) {
                OrderModel.findByIdAndRemove(order._id)
            } else {
                if (targetFood.count > 1) {
                    targetFood.count -= 1
                } else {
                    const newOrderFoods = [...order.foods].filter(f => f._id != targetFood._id)
                    order.foods = newOrderFoods
                }
                order.amount = order.foods.reduce((acc, item) => {
                    return acc + item.price * item.count
                }, 0)
                order.amountByDiscount = order.foods.reduce((acc, item) => {
                    return acc + (item.price - item.price * item.discount / 100) * item.count
                }, 0)
            }
        }
        await order.save();
        const newOrder = await OrderModel.findOne({_id: order._id})
            .populate({path: "shopId", select: "shopName shopLogo deliveryCost"})
        res.status(200).send({message: 'done', order: newOrder})
    }

    //endregion

    //region remove order
    async removeCart(req, res) {
        const result = await OrderModel.deleteOne({_id: req.params.orderId})
        if (result.deletedCount != 0){
            res.status(200).send({message: 'done'})
        }else{
            const error = new Error("حذف نشد")
            error.statusCode = 400
            throw error
        }

    }

    //endregion

    // region use discount
    async useDiscount(req, res) {
        const order = await OrderModel.findById(req.params.orderId)
        console.log(req.body.discountCode)
        const targetDiscount = await DiscountModel.findOne({discountCode: req.body.discountCode})
        if (!targetDiscount){
            const error = new Error("کد وارد شده درست نیست")
            error.statusCode = 404
            throw error
        }
        if (targetDiscount.userUsed.includes(req.user._id)) {
            const error = new Error("قبلا از این کد استفاده کردید")
            error.statusCode = 400
            throw error
        }

        if((order.amountByDiscount * targetDiscount.discount / 100) > targetDiscount.maxDiscount){
            order.amountByDiscount -= targetDiscount.maxDiscount
        }else {
            order.amountByDiscount -= order.amountByDiscount * targetDiscount.discount / 100
        }

        if (targetDiscount.count > 1){
            targetDiscount.count -= 1
            targetDiscount.userUsed.push(req.user._id)
        }else{
            await DiscountModel.findByIdAndDelete(targetDiscount._id)
        }
        await order.save()
        await targetDiscount.save()
        res.status(200).send({order})
    }

    //endregion

    //region calculate and send payment link to user
    async checkPayment(req, res) {
        const order = await OrderModel.findOne({_id: req.params.orderId})
        const shop = await ShopModel.findById(order.shopId)

        let couponDiscount = 0;
        if (order.usedCoupon && order.usedCoupon.discount > 0){
            couponDiscount = order.amountByDiscount * order.usedCoupon.discount / 100
        }
        const payment = new PaymentModel({
            orderId: order._id,
            shopId: shop._id,
            userId: order.userId,
            amount: order.amountByDiscount + shop.deliveryCost - couponDiscount,
            createDate: Date.now(),
        })
        const response = await zarinpal.PaymentRequest({
            Amount: payment.amount,
            CallbackURL: 'http://192.168.43.209:4000/api/user/verifyPayment',
            Description: `خرید از رستوران ${shop.shopName}`,
        })
        payment.paymentCode = response.authority
        if (req.body.address) {
            order.Address = req.body.address
        }
        await order.save()
        await payment.save()
        res.send({paymentUrl: response.url})
    }

    //endregion

    //region verify payment is true or not after chek payment
    async verifyPayment(req, res) {
        const paymentCode = req.query.Authority
        const status = req.query.Status
        const payment = await PaymentModel.findOne({paymentCode})
        const order = await OrderModel.findById(payment.orderId)
        const shop = await ShopModel.findById(order.shopId)
        if (order.usedCoupon){
            order.usedCoupon.usersUsed.push(order.userId)
            const newCouponList = [...[...shop.coupons.filter(c => c._id != order.usedCoupon._id)], order.usedCoupon]
            shop.coupons = newCouponList
            await shop.save()
        }
        if (status === 'OK') {
            const response = await zarinpal.PaymentVerification({
                Amount: payment.amount,
                Authority: paymentCode,
            })
            if (response.status === -21) {
                res.status(400).send("<p>filad</p>");
            } else {
                payment.refId = response.RefID
                payment.success = true
                order.isPaid = true
                order.amountByDiscount = payment.amount - shop.deliveryCost
                order.foods.map(async f => {
                    const food = await FoodModel.findOne({_id: f._id})
                    food.totalOrdered += f.count
                    await food.save()
                })
                await order.save()
                await payment.save()
                res.status(200).send(successPayment(payment));
            }
        } else {
            res.status(400).send("<p>filad</p>");
        }
    }
    //endregion

    //#region reOrder
    async reOrder (req, res){
        const PrvOrder = await OrderModel.findById(req.params.orderId)
        const user = await UserModel.findById(req.user._id)

        const newOrder = new OrderModel(_.pick(PrvOrder, ["shopId", "userId", "foods"]))
        newOrder.address = user.addresses[0]
        newOrder.createDate = Date.now()
        newOrder.foods.map(async f => {
            const targetFood = await FoodModel.findById(f._id)
            f.price = targetFood.price
            f.discount = targetFood.discount
            f.foodImage = targetFood.foodImage
        })

        newOrder.amount = newOrder.foods.reduce((acc, item) => {
            return acc + item.price * item.count
        }, 0)
        newOrder.amountByDiscount = newOrder.foods.reduce((acc, item) => {
            return acc + (item.price - (item.price * item.discount) / 100) * item.count
        }, 0)
        await newOrder.save()

        const order = await OrderModel.findOne({_id: newOrder._id})
            .populate({path: "shopId", select: "shopName shopLogo deliveryCost "})
        return res.status(201).send({order})
    }
    //#endregion

    //#region useCoupon
    async useCoupon(req, res){
        const shop = await ShopModel.findById(req.params.shopId)
        const order = await OrderModel.findOne({userId: req.user._id, shopId: shop._id, isPaid: false})
        const coupon = shop.coupons.find(c => c._id == req.body.couponId)
        if (!order){
            const error = new Error("سفارشی در این فروشگاه ندارید")
            error.statusCode = 404
            throw error
        }
        if (!coupon){
            const error = new Error("کوپنی با این مشخصات پیدا نشد")
            error.statusCode = 404
            throw error
        }
        if (coupon.usersUsed.includes(req.user._id)){
            const error = new Error("قبلا از این کوپن استفاده کردید")
            error.statusCode = 400
            throw error
        }
        order.usedCoupon = coupon
        await order.save()

        const newOrder = await OrderModel.findOne({_id: order._id})
            .populate({path: "shopId", select: "shopName shopLogo deliveryCost "})
        return res.status(200).send({order: newOrder})
    }
    //#endregion
}

module.exports = new OrderController()
