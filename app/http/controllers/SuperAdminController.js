const ShopModel = require('../../models/Shop')
const DiscountModel = require('../../models/Discount')
const _ = require('lodash')


class SuperAdminController {

    async addDiscount(req, res) {
      try {
          const discount = await new DiscountModel(_.pick(req.body, ["title", "discount", "description", "maxDiscount", "count"]))
          discount.discountCode = (Math.random() + 1).toString(36).substring(7)
          await discount.save()
          res.status(201).send({message: 'done'})
      }catch (err){
          const error = new Error(err)
          error.statusCode = 400
          throw error
      }
    }

    async deleteShop(req, res) {
        const result = ShopModel.deleteOne({_id: req.params.shopId})
        if (!result) {
            const error = new Error("حذف ناموفق بود")
            error.statusCode = 403
            throw error
        }
        res.status(200).send({message: "حذف با موفقیت انجام شد"})
    }
}

module.exports = new SuperAdminController()
