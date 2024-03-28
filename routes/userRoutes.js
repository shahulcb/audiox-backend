const express = require("express")
const { signIn, signUp, logout, updateProfile, updateAvatar, removeAvatar } = require("../controllers/userControllers")
const { authToken } = require("../middleware/auth")
const router = express.Router()
const upload = require("../utils/multer")

router.route("/sign-up").post(signUp)
router.route("/sign-in").post(signIn)
router.route("/update-profile").post(authToken, updateProfile)
router.route("/update-avatar").post(authToken, upload.single('avatar'), updateAvatar)
router.route("/remove-avatar").post(authToken, removeAvatar)
router.route("/logout").post(authToken, logout)



module.exports = router