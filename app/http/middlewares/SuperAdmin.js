
module.exports = (req, res, next) => {

    try {
        const user = req.user
        if (user.role !== 'superAdmin'){
            const err = new Error('برای دسترسی با این بخشن نیاز به حساب سوپر ادمین است')
            err.statusCode = 401
            throw err
        }
        next()
    }catch (error) {
        console.log(error)
        const err = new Error('برای دسترسی با این بخشن نیاز به حساب سوپر ادمین است')
        err.statusCode = 401
        throw err
    }
}
