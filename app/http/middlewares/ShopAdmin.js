
module.exports = (req, res, next) => {

    try {
        const user = req.user
        if (user.role !== 'shopAdmin'){
            const err = new Error('برای دسترسی با این بخشن نیاز به حساب ادمین رستوران است')
            err.statusCode = 401
            throw err
        }
        next()
    }catch (error) {
        console.log(error)
        const err = new Error('برای دسترسی با این بخشن نیاز به حساب ادمین رستوران است')
        err.statusCode = 401
        throw err
    }
}
