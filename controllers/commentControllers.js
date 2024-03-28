const asyncError = require('express-async-handler');
const commentModel = require("../models/commentModel")
const songModel = require("../models/songModel")

exports.uploadComment = asyncError(async (req, res) => {
    const { comment, songId } = req.body
    const isAuthor = await songModel.exists({ _id: songId, user: req.user_id });
    const newComment = await commentModel.create({ user: req.user_id, song: songId, text: comment, author: !!isAuthor })
    await newComment.populate("user")
    res.status(200).json({
        success: true,
        newComment
    })
})

exports.getComments = asyncError(async (req, res) => {
    const { songId } = req.params
    const comments = await commentModel.find({ song: songId }).populate("user")
    res.status(200).json({
        success: true,
        comments
    })
})

exports.deleteComment = asyncError(async (req, res) => {
    const { commentId } = req.body
    await commentModel.deleteOne({ _id: commentId, user: req.user_id })
    res.status(200).json({
        success: true,
        message: "comment deleted"
    })
})