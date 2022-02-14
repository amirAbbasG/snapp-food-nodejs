const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    const token = req.header('Authorization')
    if (!token) {
        const err = new Error('برای دسترسی با این بخشن نیاز به حساب کاربری است')
        err.statusCode = 401
        throw err
    }

    try {
        const user = jwt.verify(token, config.get('jwtKey'))
        if (!user) {
            const err = new Error('برای دسترسی با این بخشن نیاز به حساب کاربری است')
            err.statusCode = 401
            throw err
        }
        req.user = user
        next()
    } catch (error) {
        console.log(error)
        const err = new Error('برای دسترسی با این بخشن نیاز به حساب کاربری است')
        err.statusCode = 401
        throw err
    }
}
