const router = require('express').Router()
const Auth = require('../http/middlewares/Auth')
const UserController = require('../http/controllers/UserController')
const CommentController = require('../http/controllers/CommentController')
const OrderController = require('../http/controllers/OrderController')
const ShopController = require('../http/controllers/ShopController')
const FoodController = require('../http/controllers/FoodController')

//get
router.get('/shops', ShopController.shopsList)
router.get('/shopDetail/:shopId', ShopController.getShopDetails)
router.get('/userInformation',Auth, UserController.userInformation)
router.get('/foods/:shopId', FoodController.foodsList)
router.get('/foods/:foodId', FoodController.getFoodDetails)
router.get('/checkPayment/:orderId',Auth, OrderController.checkPayment)
router.get('/verifyPayment', OrderController.verifyPayment)
router.get('/getOrders',Auth, OrderController.getOrders)
router.get('/getPayments',Auth, OrderController.getPayments)
router.get('/getUserComments',Auth, CommentController.getUserComments)



//post
router.post('/verifyNumber', UserController.verifyNumber)
router.post('/checkNumber', UserController.checkNumber)
router.post('/comment/:id',Auth, CommentController.comment)
router.post('/login', UserController.login)
router.post('/register', UserController.register)
router.post('/addToCart/:foodId',Auth, OrderController.addToCart)
router.post('/forgetPassword', UserController.forgetPassword)
router.post('/changePassword', UserController.changePassword)
router.post('/useDiscount/:orderId',Auth, OrderController.useDiscount)
router.post('/reOrder/:orderId',Auth, OrderController.reOrder)

//put
router.put('/editProfile',Auth, UserController.editProfile)
router.put('/addShopToFavorites/:shopId',Auth, UserController.addShopToFavorites)
router.put('/removeShopFromFavorites/:id',Auth, UserController.removeShopFromFavorites)
router.put('/changeAuthenticatedUserPassword',Auth, UserController.changeAuthenticatedUserPassword)
router.put('/useCoupon/:shopId',Auth, OrderController.useCoupon)

//delete
router.delete('/removeFoodFromCart/:foodId',Auth, OrderController.removeFoodFromCart)
router.delete('/removeCart/:orderId',Auth, OrderController.removeCart)

module.exports = router
