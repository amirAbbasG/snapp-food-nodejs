const router = require('express').Router()
const SuperAdminController = require('../http/controllers/SuperAdminController')
const Auth = require("../http/middlewares/Auth")
const SuperAdmin = require("../http/middlewares/SuperAdmin")




router.delete('/shop/:shopId',Auth, SuperAdmin, SuperAdminController.deleteShop)
router.post('/addDiscount',Auth, SuperAdminController.addDiscount)


module.exports = router
