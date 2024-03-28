const express = require("express")
const { uploadSong, getMySongs, songDetails, deleteMySong, getAllSongs, getSongsByUser, getSongDetails, updateSongDetails } = require("../controllers/songControllers")
const router = express.Router()
const { authToken } = require("../middleware/auth")
const upload = require("../utils/multer")

router.route("/upload-song").post(authToken, upload.fields([{ name: 'song', maxCount: 1 }, { name: 'image', maxCount: 1 }]), uploadSong)
router.route("/get-all-songs").get(authToken, getAllSongs)
router.route("/get-my-songs").get(authToken, getMySongs)
router.route("/song-details/:songId").get(authToken, songDetails)
router.route("/delete-my-song").post(authToken, deleteMySong)
router.route("/get-songs-by-user/:userId").get(authToken, getSongsByUser)
router.route("/get-song-details/:songId").get(authToken, getSongDetails)
router.route("/update-song-details").post(upload.single("image"), authToken, updateSongDetails)

module.exports = router

