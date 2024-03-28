const asyncError = require('express-async-handler');
const songModel = require('../models/songModel')
const userModel = require("../models/userModel")

exports.getSearchResult = asyncError(async (req, res) => {
    const { type, query } = req.params
    let songs = []
    let users = []
    if (type === 'artist') {
        users = await userModel.find({ username: { $regex: `^${query}`, $options: 'i' } })
    }
    if (type === "song") {
        songs = await songModel.find({ title: { $regex: `^${query}`, $options: 'i' } }).populate("user", "username")
    }
    if (type === "genre") {
        songs = await songModel.find({ genre: { $regex: `^${query}`, $options: 'i' } }).populate("user", "username")
    }
    if (type === 'artist') {
        return res.status(200).json({
            success: true,
            users
        })
    } else {
        return res.status(200).json({
            success: true,
            songs
        })
    }
})