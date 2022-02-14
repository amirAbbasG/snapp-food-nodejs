const _ = require('lodash')
const ShopModel = require('../../models/Shop')
const FoodModel = require('../../models/Food')
const CommentModel = require('../../models/Comment')
const { commentValidator} = require("../validators/UserValidator");




class CommentController {
    //region comment for a restaurant or food
    async comment(req, res) {
        const {error} = commentValidator(req.body)
        if (error) {
            const err = new Error(error.message)
            err.statusCode = 400
            throw err
        }
        const newComment = {
            sender: req.user.fullName,
            text: req.body.text,
            score: req.body.score,
            createDate: Date.now()
        }
        const addComment = await new CommentModel(newComment)

        const food = await FoodModel.findOne({_id: req.params.id})
        if (food) {
            food.comments.push(addComment._id)
            await food.save()
        } else {
            const shop = await ShopModel.findOne({_id: req.params.id})
            if (shop) {
                shop.comments.push(addComment._id)
                await shop.save()
            } else {
                const err = new Error("غدا یا رستوران مورد نطر پیدا نشد")
                err.statusCode = 400
                throw err
            }
        }
        await addComment.save()
        res.status(201).send({message: 'done', comment: addComment})
    }

    //endregion

    //region replay comment
    async replayComment (req, res) {
        const targetComment = await CommentModel.findOne({_id: req.params.commentId})
        if (!targetComment){
            const err = new Error('کامنت  با ای مشخصات پیدا نشد')
            err.statusCode = 404
            throw err
        }
        targetComment.replay = req.body.replayText
        await targetComment.save();
        res.status(200).send({message: "done", comment: targetComment})
    }
    //endregion

    //region get list of user comments
    async getUserComments(req, res) {
        const comments = await CommentModel.find({userId: req.user._id})
        res.status(200).send({comments, message: 'done'})
    }

    //endregion

}

module.exports = new CommentController()
