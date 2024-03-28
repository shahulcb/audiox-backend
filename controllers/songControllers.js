const asyncError = require('express-async-handler');
const songModel = require('../models/songModel');
const playlistModel = require("../models/playlistModel")
const cloudinary = require("../utils/cloudinary")

exports.uploadSong = asyncError(async (req, res) => {
    const songPath = req.files['song'][0].path
    const imagePath = req.files['image'][0].path
    const { title, genre } = req.body;
    try {
        const songResult = await cloudinary.uploader.upload(songPath, { folder: 'audiox/songs', resource_type: 'auto' })
        const imageResult = await cloudinary.uploader.upload(imagePath, { folder: 'audiox/songs-image', resource_type: 'auto' })
        const newSong = await songModel.create({ title, genre, filePath: songResult.secure_url, bgImage: imageResult.secure_url, user: req.user_id })
        if (!newSong) {
            return res.status(404).json({
                success: false,
                message: "Failed to upload song"
            })
        }
        res.status(200).json({
            success: true,
            message: "song uploaded"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

})

exports.getAllSongs = asyncError(async (req, res) => {
    const songs = await songModel.find().sort({ createdAt: -1 }).populate("user")
    res.status(200).json({
        success: true,
        songs
    })
})

exports.getMySongs = asyncError(async (req, res) => {
    const songs = await songModel.find({ user: req.user_id }).populate("user")
    res.status(200).json({
        success: true,
        songs
    })
})

exports.songDetails = asyncError(async (req, res) => {
    const { songId } = req.params
    const songInfo = await songModel.findOne({ _id: songId }).populate("user")
    const playlistsWithSong = await playlistModel.findOne({ user: req.user_id, songs: songId })
    !!playlistsWithSong
    res.status(200).json({
        success: true,
        songInfo,
        playlistsWithSong
    })
})

exports.checkPlaylist = asyncError(async (req, res) => {

})

exports.deleteMySong = asyncError(async (req, res) => {
    const { songId } = req.body

    const playlists = await playlistModel.find({ songs: songId })

    const playlistUpdatePromises = playlists.map(async (playlist) => {
        playlist.songs.pull(songId)
        await playlist.save()
    })

    await Promise.all(playlistUpdatePromises);

    await songModel.deleteOne({ _id: songId, user: req.user_id })

    res.status(200).json({
        success: true,
        message: "song deleted!"
    })
})

exports.getSongsByUser = asyncError(async (req, res) => {
    const { userId } = req.params
    const songs = await songModel.find({ user: userId })
    res.status(200).json({
        success: true,
        songs
    })
})

exports.getSongDetails = asyncError(async (req, res) => {
    const { songId } = req.params
    const songDetails = await songModel.findOne({ user: req.user_id, _id: songId })
    res.status(200).json({
        success: true,
        songDetails
    })
})

exports.updateSongDetails = asyncError(async (req, res) => {
    const { title, genre, songId } = req.body
    let bgImageURL = ''
    const song = await songModel.findById(songId)
    bgImageURL = song.bgImage
    if (req.file?.path !== undefined) {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'audiox/songs-image', resource_type: 'auto' })
        bgImageURL = result.secure_url
    }
    const updatedSongDetails = await songModel.findOneAndUpdate({ _id: songId, user: req.user_id }, { $set: { title, genre, bgImage: bgImageURL } }, { new: true })
    res.status(200).json({
        success: true,
        message: "song details updated"
    })
})