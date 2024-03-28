const express = require("express")
const { createPlaylist, listAllPlaylists, listPlaylistSong, deletePlaylist, updatePlaylist, addToPlaylist } = require("../controllers/playlistControllers")
const { authToken } = require("../middleware/auth")
const router = express.Router()

router.route("/list-all-playlists").get(authToken, listAllPlaylists)
router.route("/create-playlist").post(authToken, createPlaylist)
router.route("/list-playlist-songs/:playlistId").get(authToken, listPlaylistSong)
router.route("/update-playlist").post(authToken, updatePlaylist)
router.route("/delete-playlist").post(authToken, deletePlaylist)
router.route("/add-to-playlist").post(authToken, addToPlaylist)

module.exports = router