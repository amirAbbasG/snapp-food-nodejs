const router = require('express').Router()
const UserRoutes = require('./UserRoutes')
const ShopAdminRoutes = require('./ShopAdminRoutes')
const SuperAdminRoutes = require('./SuperAdminRoutes')

router.use('/user', UserRoutes)
router.use('/shopAdmin', ShopAdminRoutes)
router.use('/superAdmin', SuperAdminRoutes)

module.exports = router