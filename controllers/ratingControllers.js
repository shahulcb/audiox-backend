const asyncError = require('express-async-handler');
const ratingModel = require("../models/ratingModel")
const songModel = require("../models/songModel")

exports.addRating = asyncError(async (req, res) => {
    const { songId, rating } = req.body
    const isRatingExist = await ratingModel.findOne({ user: req.user_id, song: songId })
    if (isRatingExist) {
        isRatingExist.rating = rating
        await isRatingExist.save()
        return res.status(200).json({
            success: true,
            newRating: isRatingExist.rating
        })
    }
    const newRating = await ratingModel.create({ user: req.user_id, song: songId, rating })
    res.status(200).json({
        success: true,
        newRating: newRating.rating
    })
})

exports.getRating = asyncError(async (req, res) => {
    const { songId } = req.params
    const songRating = await ratingModel.findOne({ song: songId, user: req.user_id })
    res.status(200).json({
        success: true,
        rating: songRating?.rating
    })
})

exports.getOverallRating = asyncError(async (req, res) => {
    const { songId } = req.params
    const ratings = await ratingModel.find({ song: songId })
    if (ratings.length === 0) {
        return res.status(200).json({
            success: true,
            overallRating: 0
        })
    }
    const totalRating = ratings.reduce((acc, curr) => acc + curr.rating, 0)

    const overallRating = totalRating / ratings.length

    res.status(200).json({
        success: true,
        overallRating
    })
})

exports.getPopularSong = asyncError(async (req, res) => {
    const topSongs = await ratingModel.aggregate([
        {
            $group: {
                _id: "$song",
                averageRating: { $avg: "$rating" }
            }
        },
        {
            $sort: { averageRating: -1 }
        },
        {
            $limit: 10
        }
    ]);

    const topSongsWithDetails = await Promise.all(topSongs.map(async (song) => {
        const songDetails = await songModel.findById(song._id).populate("user", "username")
        return {
            songId: song._id,
            title: songDetails.title,
            bgImage: songDetails.bgImage,
            user: songDetails.user.username
        };
    }));


    res.status(200).json({
        success: true,
        topSongs: topSongsWithDetails
    });
})