const express = require("express")
const router = express.Router()
const { authToken } = require("../middleware/auth")
const { addRating, getRating, getOverallRating, getPopularSong } = require("../controllers/ratingControllers")

router.route("/add-rating").post(authToken, addRating)
router.route("/get-rating/:songId").get(authToken, getRating)
router.route("/get-overall-rating/:songId").get(authToken, getOverallRating)
router.route("/get-popular-songs").get(authToken, getPopularSong)


module.exports = router