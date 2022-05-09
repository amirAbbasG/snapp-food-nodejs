const _ = require('lodash')
const bcrypt = require('bcrypt')
const UserModel = require('../../models/User')
const ActiveNumberModel = require('../../models/ActiveNumber')
const {sendCode, isValidCode} = require("../hellpers/sendCode");
const {
    numberValidator,
    userRegisterValidator,
    userLoginValidator,
    userEditValidator,
    changePasswordValidator
} = require('../validators/UserValidator')
const ZarinpalCheckout = require('zarinpal-checkout')
zarinpal = ZarinpalCheckout.create('00000000-0000-0000-0000-000000000000', true)

class UserController {


    //region user get the account information
    async userInformation(req, res) {
        const user = await UserModel.findOne({_id: req.user._id}).select("-password").populate({
            path: "favoriteShop",
            select: "-userNumber -userPassword -ownerFullName -coupons -foods",
            populate:
                {
                    path: 'comments',
                    select: 'score -_id'
                },
        })
        res.status(200).send({user, message: true})
    }

    //endregion

    //region login user
    async login(req, res) {
        const {error} = userLoginValidator(req.body)
        if (error) {
            const err = new Error(error.message)
            err.statusCode = 400
            throw err
        }
        const user = await UserModel.findOne({number: req.body.number})
        if (!user) {
            const error = new Error("کاربری با ای مشخصات پیدا نشد")
            error.statusCode = 404
            throw error
        }
        const result = await bcrypt.compare(req.body.password, user.password)
        if (!result) {
            const error = new Error("کاربری با ای مشخصات پیدا نشد")
            error.statusCode = 404
            throw error
        }
        const token = user.genAuthToken()
        res.status(200).send({message: 'done', token, userId: user._id})
    }

    //endregion

    //region register user after verify number
    async register(req, res) {
        const {error} = userRegisterValidator(req.body)
        if (error) {
            const err = new Error(error.message)
            err.statusCode = 400
            throw err
        }
        const activeNumber = await ActiveNumberModel.findOne({number: req.body.number})
        if (!activeNumber) {
            const error = new Error("شماره فعال نشده")
            error.statusCode = 400
            throw error
        }
        const user = await new UserModel(_.pick(req.body, ['number', 'fullName']))
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        user.password = hashedPassword
        await user.save()
        console.log(user)
        const token = user.genAuthToken()
        res.status(201).send({message: 'done', token, userId: user._id})
    }

    //endregion

    //region get a valid data and edit user
    async editProfile(req, res) {
        const {error} = userEditValidator(req.body)
        if (error) {
            const err = new Error(error.message)
            err.statusCode = 400
            throw err
        }
        const user = await UserModel.findOne({_id: req.user._id})
        if (!user) {
            const error = new Error("کاربری با ای مشخصات پیدا نشد")
            error.statusCode = 404
            throw error
        }
        user.fullName = req.body.fullName
        if (req.body.email) {
            user.email = req.body.email
        }

        if (req.body.creditCardNumber) {
            user.creditCardNumber = req.body.creditCardNumber
        }

        if (req.body.address) {
            user.addresses.push(req.body.address)
        }
        await user.save()
        const token = user.genAuthToken()
        res.status(200).send({message: 'done', token, userId: user._id})
    }

    //endregion

    //region get number from user chek if is in db send login action if its not sent code for verify
    async checkNumber(req, res) {
        const {error} = numberValidator(req.body)
        if (error) {
            const err = new Error(error.message)
            err.statusCode = 400
            throw err
        }
        const user = await UserModel.findOne({number: req.body.number})
        if (user) return res.status(200).send({message: 'done', action: 'login'})
        sendCode(req.body.number, (response, status) => {
            if (status === 200) {
                res.status(200).send({message: 'done', action: "sendCode"})
            } else {
                const error = new Error("مشکلی پیش آمده")
                error.statusCode = status
                throw error
            }
        })
    }

    //endregion

    //region check if code true send action for continue to register
    async verifyNumber(req, res) {

        if (isValidCode(req.body.code, req.body.number)) {
            const activeNumber = await new ActiveNumberModel({number: req.body.number})
            await activeNumber.save()
            res.status(200).send({action: "register", success: true})
        } else {
            const error = new Error("کد ارسال شده نادرست است")
            error.statusCode = 400
            throw error
        }
    }

    //endregion

    //region add shop to favorite
    async addShopToFavorites(req, res) {
        const user = await UserModel.findOne({_id: req.user._id})
        if (!user) {
            const error = new Error("کاربری با ای مشخصات پیدا نشد")
            error.statusCode = 404
            throw error
        }
        user.favoriteShop.push(req.params.shopId)
        await user.save()
        res.status(200).send({message: "done"})
    }

    //endregion

    //region remove shop from favorite
    async removeShopFromFavorites(req, res) {
        const user = await UserModel.findOne({_id: req.user._id})
        if (!user) {
            const error = new Error("کاربری با ای مشخصات پیدا نشد")
            error.statusCode = 404
            throw error
        }
        const foundIndex = user.favoriteShop.findIndex(f => f._id == req.params.id)
        user.favoriteShop.splice(foundIndex, 1)
        await user.save()
        res.status(200).send({message: "done"})
    }

    //endregion

    //region user forgot the password
    async forgetPassword(req, res) {
        sendCode(req.body.number, (response, status) => {
            if (status === 200) {
                res.status(200).send({message: 'done', action: 'changePassword'})
            } else {
                const error = new Error("مشکلی پیش آمده")
                error.statusCode = 404
                throw error
            }
        })

    }

    //endregion

    //region change user password
    async changePassword(req, res) {
        const {error} = changePasswordValidator(req.body)
        if (error) {
            const err = new Error(error.message)
            err.statusCode = 400
            throw err
        }
        if (!isValidCode(req.body.code, req.body.number)) {
            const error = new Error("کد ارسال شده نادرست است")
            error.statusCode = 400
            throw error
        }

        const user = await UserModel.findOne({number: req.body.number})
        if (!user) {
            const error = new Error("کاربری با ای مشخصات پیدا نشد")
            error.statusCode = 404
            throw error
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        user.password = hashedPassword
        await user.save()
        res.status(200).send({message: "done", action: 'login'})
    }

    //endregion

    //region Authenticated change profile password by entering old password
    async changeAuthenticatedUserPassword(req, res) {
        const user = await UserModel.findOne({_id: req.user._id});
        if (!user) {
            const error = new Error("کاربری با ای مشخصات پیدا نشد")
            error.statusCode = 404
            throw error
        }
        if (bcrypt.compare(req.body.oldPassword, user.password)) {
            const salt = await bcrypt.genSalt(10)
            const hashedNewPassword = await bcrypt.hash(req.body.newPassword, salt)
            user.password = hashedNewPassword
            await user.save()
            res.status(200).send({message: 'done'})
        } else {
            const error = new Error("پسورد فعلی درست نیست")
            error.statusCode = 400
            throw error
        }
    }

    //endregion


}

module.exports = new UserController()
