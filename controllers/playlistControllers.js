const playlistModel = require("../models/playlistModel")
const asyncError = require('express-async-handler');
const songModel = require("../models/songModel");

exports.listAllPlaylists = asyncError(async (req, res) => {
    const playlists = await playlistModel.find({ user: req.user_id })
    res.status(202).json({
        success: true,
        playlists
    })
})

exports.createPlaylist = asyncError(async (req, res) => {
    const { title } = req.body
    const newPlaylist = await playlistModel.create({ user: req.user_id, title })
    if (!newPlaylist) {
        return res.status(500).json({
            success: false,
            message: "Failed to create playlist"
        })
    }
    res.status(200).json({
        success: true,
        message: `Playlist (${title}) created `,
        newPlaylist
    })
})

exports.listPlaylistSong = asyncError(async (req, res) => {
    const { playlistId } = req.params
    const playlist = await playlistModel.findOne({ _id: playlistId, user: req.user_id }).populate({ path: 'song', options: { strictPopulate: false } })
    const songs = [];
    for (const song of playlist.songs) {
        const songDetail = await songModel.findById(song._id).populate("user", "username");
        songs.push(songDetail);
    }
    res.status(200).json({
        success: true,
        playlist,
        songs
    })
})

exports.updatePlaylist = asyncError(async (req, res) => {
    const { idsForDelete, playlistId, title } = req.body
    await playlistModel.findByIdAndUpdate(playlistId, { title })
    if (idsForDelete.length > 0) {
        for (const id of idsForDelete) {
            await playlistModel.findByIdAndUpdate({ _id: playlistId }, { $pull: { songs: id } })
        }
    }
    res.status(200).json({
        success: true,
        message: "Playlist updated"
    })
})

exports.deletePlaylist = asyncError(async (req, res) => {
    const { playlistId } = req.body
    const playlist = await playlistModel.findOne({ _id: playlistId, user: req.user_id })
    await playlistModel.deleteOne({ _id: playlistId, user: req.user_id })
    res.status(200).json({
        message: `Playlist (${playlist.title}) deleted`
    })
})

exports.addToPlaylist = asyncError(async (req, res) => {
    const { playlistId, songId } = req.body
    const updatePlaylist = await playlistModel.findByIdAndUpdate(playlistId, { $addToSet: { songs: songId } }, { new: true })
    if (!updatePlaylist) {
        res.status(500).json({
            success: false,
            message: "failed!"
        })
    }
    res.status(202).json({
        success: true,
        message: "song added!"
    })
})