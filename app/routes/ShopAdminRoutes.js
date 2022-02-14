const router = require('express').Router()
const multer = require('multer')
const Auth = require('../http/middlewares/Auth')
const ShopAdmin = require('../http/middlewares/ShopAdmin')
const imageFilter = require('../http/hellpers/imageFilter')
const ShopController = require('../http/controllers/ShopController')
const ShopAdminController = require('../http/controllers/ShopAdminController')
const FoodController = require('../http/controllers/FoodController')
const CommentController = require('../http/controllers/CommentController')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname)
    }
})

const upload = multer({storage, fileFilter: imageFilter})
// get
router.get('/supportedCities', ShopAdminController.supportedCities)
router.get('/shopTypes', ShopController.shopTypes)
//post
router.post('/login', ShopAdminController.login)
router.post('/addFood',Auth, ShopAdmin, upload.single("foodImage"), FoodController.addFood)
router.post('/register', ShopAdminController.register)
router.post('/checkNumber', ShopAdminController.checkNumber)

//put
router.put('/editShop',Auth, ShopAdmin, upload.single('shopImage'), ShopController.editShop)
router.put('/food/:foodId',Auth, ShopAdmin, upload.single("foodImage"), FoodController.editFood)
router.put('/replayComment/:commentId',Auth, ShopAdmin, CommentController.replayComment)
router.put('/addCoupons',Auth, ShopAdmin,upload.single("icon"), ShopController.addCoupons)
router.put('/removeCoupon/:couponId',Auth, ShopAdmin, ShopController.removeCoupons)
router.put('/setDiscount/:foodId',Auth, ShopAdmin, FoodController.setDiscount)

//delete
router.delete('/food/:foodId',Auth, ShopAdmin, FoodController.deleteFood)

module.exports = router
