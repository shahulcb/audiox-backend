const express = require("express")
const { authToken } = require("../middleware/auth")
const { uploadComment, getComments, deleteComment } = require("../controllers/commentControllers")
const router = express.Router()

router.route("/upload-comment").post(authToken, uploadComment)
router.route("/get-comments/:songId").get(authToken, getComments)
router.route("/delete-comment").post(authToken, deleteComment)

module.exports = router